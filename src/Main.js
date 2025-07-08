import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;

function Main() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const initialForm = {
    title: '',
    importance: 5,
    dueDate: '',
    group: '',
    recurrence: {
      type: 'none', // 'none' | 'daily' | 'weekly' | 'monthly'
      days: [],     // for weekly
      date: ''      // for monthly
    }
  };
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [filter, setFilter] = useState('all');
  const [newGroup, setNewGroup] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifiedTasks, setNotifiedTasks] = useState(new Set());

  useEffect(() => {
    // If the logged-in user does not match the URL, redirect to their own page
    console.log('User object:', user);
    console.log('Username from URL:', username);
    if (user && user.name !== username) {
      console.log('Redirecting to:', `/main/${user.name}`);
      navigate(`/main/${user.name}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [user, username, navigate]);

  useEffect(() => {
    fetchAll();
    // Check for due tasks every minute
    const interval = setInterval(checkDueTasks, 60000);
    
    // Request notification permission on component mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setShowNotifications(true);
        }
      });
    }
    
    return () => clearInterval(interval);
  }, []);

  const checkDueTasks = () => {
    const now = new Date();
    const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    
    const dueSoonTasks = tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate <= sixHoursFromNow && dueDate > now && !notifiedTasks.has(task._id);
    });

    dueSoonTasks.forEach(task => {
      sendNotification(task);
      setNotifiedTasks(prev => new Set([...prev, task._id]));
    });
  };

  const sendNotification = async (task) => {
    // Web notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Due Soon!', {
        body: `${task.title} is due in less than 6 hours. Finish it fast!`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }

    // Email notification (you'll need to implement this on backend)
    try {
      await axios.post(`${API_BASE}/notifications/email`, {
        taskId: task._id,
        taskTitle: task.title,
        dueDate: task.dueDate
      }, { withCredentials: true });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setShowNotifications(true);
        }
      });
    }
  };

  const fetchAll = async () => {
    try {
      const [taskRes, groupRes] = await Promise.all([
        axios.get(`${API_BASE}/tasks`, { withCredentials: true }),
        axios.get(`${API_BASE}/groups`, { withCredentials: true }),
      ]);
      setTasks(taskRes.data);
      setGroups(groupRes.data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
      } else {
        alert(`Error fetching data: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      recurrence: {
        type: form.recurrence.type,
        days: form.recurrence.type === 'weekly' ? form.recurrence.days : undefined,
        date: form.recurrence.type === 'monthly' ? form.recurrence.date : undefined
      }
    };
    if (editingTask) {
      await updateTask(editingTask._id, payload);
    } else {
      await createTask(payload);
    }
    resetForm();
  };

  const createTask = async (payload) => {
    await axios.post(`${API_BASE}/tasks`, payload, { withCredentials: true });
    await fetchAll();
  };

  const updateTask = async (id, data) => {
    await axios.put(`${API_BASE}/tasks/${id}`, data, { withCredentials: true });
    await fetchAll();
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await axios.delete(`${API_BASE}/tasks/${id}`, { withCredentials: true });
      await fetchAll();
    }
  };
  
  const resetForm = () => {
    setEditingTask(null);
    setForm(initialForm);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      importance: task.importance,
      dueDate: task.dueDate?.split('T')[0] || '',
      completed: task.completed,
      group: task.group || '',
      recurrence: task.recurrence || { type: 'none', days: [], date: '' }
    });
  };
  
  const handleNewGroup = async () => {
    if (!newGroup.trim()) return;
    try {
      await axios.post(`${API_BASE}/groups`, { name: newGroup.trim() }, { withCredentials: true });
      setNewGroup('');
      await fetchAll();
    } catch (error) {
      console.error('Group creation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create group.';
      alert(errorMessage);
    }
  };

  const getFilterButtonClass = (filterName) => {
    return filter === filterName 
      ? "filter-btn filter-btn-active" 
      : "filter-btn filter-btn-inactive";
  };
  
  const renderStars = (rating, isForm = false, onRatingChange = null) => {
    const currentRating = isForm ? rating : rating;
    
    return Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
      <span
        key={i}
        className={`star-neon cursor-pointer text-lg transition-all duration-200 ${
          i <= (hoverRating || currentRating) ? 'text-neon-green' : 'text-gray-500'
        } hover:scale-110`}
        onMouseEnter={() => setHoverRating(i)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => {
          if (onRatingChange) onRatingChange(i);
          if (isForm) setForm({ ...form, importance: i });
        }}
      >
        ★
      </span>
    ));
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredTasks = tasks
    .filter((task) => {
      switch (filter) {
        case 'myday':
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate.toDateString() === today.toDateString();
        case 'important':
          return task.importance >= 7;
        case 'upcoming':
          if (task.completed || !task.dueDate) return false;
          const taskDueDate = new Date(task.dueDate);
          return taskDueDate > today;
        case 'all':
          return true;
        default:
          return task.group === filter;
      }
    })
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (filter === 'upcoming') {
            const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
            const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
            return dateA - dateB;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const getTaskPriorityColor = (importance) => {
    if (importance >= 8) return 'task-card-priority-high';
    if (importance >= 6) return 'task-card-priority-medium';
    return 'task-card-priority-low';
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return { text: 'No due date', color: 'text-gray-400' };
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-400' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-400' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-400' };
    if (diffDays <= 3) return { text: `Due in ${diffDays} days`, color: 'text-neon-green' };
    return { text: `Due ${due.toLocaleDateString()}`, color: 'text-gray-400' };
  };

  return (
    <div className="main-container-neon">
      {/* Sidebar */}
      <aside className="sidebar-neon">
        <div className="sidebar-header">
          <h2 className="welcome-text">Welcome back, {user?.name}!</h2>
          <p className="welcome-subtitle">Let's get things done today</p>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{tasks.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value stat-completed">{tasks.filter(t => t.completed).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value stat-pending">{tasks.filter(t => !t.completed).length}</span>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <h3 className="section-title">Quick Filters</h3>
          <div className="filters-grid">
            <button onClick={() => setFilter('all')} className={getFilterButtonClass('all')}>
              <span className="filter-icon">📋</span>
              <span>All Tasks</span>
            </button>
            <button onClick={() => setFilter('myday')} className={getFilterButtonClass('myday')}>
              <span className="filter-icon">🌞</span>
              <span>My Day</span>
            </button>
            <button onClick={() => setFilter('important')} className={getFilterButtonClass('important')}>
              <span className="filter-icon">❗</span>
              <span>Important</span>
            </button>
            <button onClick={() => setFilter('upcoming')} className={getFilterButtonClass('upcoming')}>
              <span className="filter-icon">📅</span>
              <span>Upcoming</span>
            </button>
          </div>
        </div>

        <div className="groups-section">
          <h3 className="section-title">Groups</h3>
          <div className="groups-list">
            {groups.map((group) => (
              <button 
                key={group._id} 
                onClick={() => setFilter(group.name)} 
                className={getFilterButtonClass(group.name)}
              >
                <span className="group-icon">#</span>
                <span>{group.name}</span>
              </button>
            ))}
          </div>
          
          <div className="new-group-form">
            <input
              className="group-input"
              placeholder="New group..."
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNewGroup()}
            />
            <button 
              onClick={handleNewGroup} 
              className="add-group-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="notifications-section">
          <h3 className="section-title">Notifications</h3>
          {Notification.permission === 'granted' ? (
            <div className="notification-status notification-enabled">
              <div className="status-icon">✅</div>
              <div className="status-content">
                <span className="status-title">Notifications Enabled</span>
                <span className="status-desc">You'll receive alerts for tasks due within 6 hours</span>
              </div>
            </div>
          ) : Notification.permission === 'denied' ? (
            <div className="notification-status notification-blocked">
              <div className="status-icon">❌</div>
              <div className="status-content">
                <span className="status-title">Notifications Blocked</span>
                <span className="status-desc">Please enable notifications in your browser settings</span>
              </div>
            </div>
          ) : (
            <button 
              onClick={requestNotificationPermission}
              className="enable-notifications-btn"
            >
              Enable Notifications
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content-neon">
        <div className="content-wrapper">
          <div className="page-header">
            <h1 className="page-title">
              {filter === 'all' ? 'All Tasks' : 
               filter === 'upcoming' ? 'Upcoming Tasks' : 
               filter === 'myday' ? 'My Day' : 
               filter === 'important' ? 'Important Tasks' : 
               `#${filter}`}
            </h1>
            <p className="page-subtitle">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>

          {/* Task Form */}
          <div className="task-form-container">
            <form onSubmit={handleFormSubmit}>
              <div className="form-header">
                <input
                  className="task-input"
                  placeholder="What's on your mind?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <button 
                  type="submit" 
                  className="submit-btn"
                >
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </button>
                {editingTask && (
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              <div className="form-options">
                <div className="option-group">
                  <span className="option-label">Priority:</span>
                  <div className="stars-container">
                    {renderStars(form.importance, true)}
                  </div>
                </div>
                
                <div className="option-group">
                  <span className="option-label">Due Date:</span>
                  <input
                    className="date-input"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
                
                <div className="option-group">
                  <span className="option-label">Group:</span>
                  <select
                    className="group-select"
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value })}
                  >
                    <option value="">No Group</option>
                    {groups.map((g) => <option key={g._id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>

                <div className="option-group">
                  <span className="option-label">Repeat:</span>
                  <select
                    className="group-select"
                    value={form.recurrence.type}
                    onChange={e => setForm({
                      ...form,
                      recurrence: { type: e.target.value, days: [], date: '' }
                    })}
                  >
                    <option value="none">None</option>
                    <option value="daily">Every day</option>
                    <option value="weekly">Specific days</option>
                    <option value="monthly">Every Nth of month</option>
                  </select>
                </div>
                {form.recurrence.type === 'weekly' && (
                  <div className="option-group">
                    <span className="option-label">Days:</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
                        <label key={i} style={{ color: form.recurrence.days.includes(i) ? 'var(--neon-green)' : 'var(--text-secondary)', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={form.recurrence.days.includes(i)}
                            onChange={e => {
                              const days = form.recurrence.days.includes(i)
                                ? form.recurrence.days.filter(x => x !== i)
                                : [...form.recurrence.days, i];
                              setForm({ ...form, recurrence: { ...form.recurrence, days } });
                            }}
                            style={{ marginRight: 4 }}
                          />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {form.recurrence.type === 'monthly' && (
                  <div className="option-group">
                    <span className="option-label">Date:</span>
                    <input
                      className="date-input"
                      type="number"
                      min="1"
                      max="31"
                      value={form.recurrence.date}
                      onChange={e => setForm({ ...form, recurrence: { ...form.recurrence, date: e.target.value } })}
                      placeholder="e.g. 6 for every 6th"
                      style={{ width: 100 }}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Search */}
          <div className="search-container">
            <div className="search-wrapper">
              <input
                className="search-input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Task List */}
          <div className="tasks-container">
            {filteredTasks.map((task) => {
              const dueStatus = getDueDateStatus(task.dueDate);
              return (
                <div 
                  key={task._id} 
                  className={`task-card ${getTaskPriorityColor(task.importance)}`}
                >
                  <div className="task-content">
                    <div className="task-main">
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task._id, { completed: !task.completed })}
                      />
                      
                      <div className="task-details">
                        <h3 className={`task-title ${task.completed ? 'task-completed' : ''}`}>
                          {task.title}
                        </h3>
                        
                        <div className="task-meta">
                          <span className={`due-status ${dueStatus.color}`}>{dueStatus.text}</span>
                          {task.group && (
                            <span className="group-badge">
                              #{task.group}
                            </span>
                          )}
                          <div className="priority-stars">
                            {renderStars(task.importance)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="task-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(task)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => deleteTask(task._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">No tasks found</h3>
                <p className="empty-desc">Create your first task to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Main;
