import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const API_BASE = process.env.REACT_APP_API_URL;
const NEON_GREEN = '#00ff88';
const NEON_PURPLE = '#8b5cf6';
const NEON_RED = '#ef4444';
const NEON_ORANGE = '#f97316';
const NEON_BG = '#0a0a0a';

function Dashboard() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    currentStreak: 0,
    averagePriority: 0,
    tasksCompletedToday: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [pendingByImportance, setPendingByImportance] = useState([]); // New state for pending tasks by importance
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.name !== username) {
      navigate(`/dashboard/${user.name}`, { replace: true });
    }
  }, [user, username, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tasks`, { withCredentials: true });
      const tasksData = response.data;
      setTasks(tasksData);
      
      // Calculate statistics
      calculateStats(tasksData);
      calculateWeeklyData(tasksData);
      calculatePriorityData(tasksData);
      calculatePendingByImportance(tasksData); // New calculation
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateStats = (tasksData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalTasks = tasksData.length;
    const completedTasks = tasksData.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasksData.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < today;
    }).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const averagePriority = tasksData.length > 0 
      ? Math.round(tasksData.reduce((sum, task) => sum + task.importance, 0) / tasksData.length)
      : 0;
    
    const tasksCompletedToday = tasksData.filter(task => {
      if (!task.completed || !task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= today;
    }).length;

    // Calculate current streak
    const currentStreak = calculateStreak(tasksData);

    setStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      currentStreak,
      averagePriority,
      tasksCompletedToday
    });
  };

  const calculateStreak = (tasksData) => {
    const completedTasks = tasksData.filter(task => task.completed && task.completedAt);
    if (completedTasks.length === 0) return 0;

    const sortedTasks = completedTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayTasks = sortedTasks.filter(task => {
        const taskDate = new Date(task.completedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === currentDate.getTime();
      });

      if (dayTasks.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateWeeklyData = (tasksData) => {
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayTasks = tasksData.filter(task => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt);
        return taskDate >= date && taskDate < nextDate;
      });
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayTasks.length,
        date: date
      });
    }
    
    setWeeklyData(weekData);
  };

  const calculatePriorityData = (tasksData) => {
    const priorityCounts = {};
    
    tasksData.forEach(task => {
      const priority = task.importance;
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });
    
    const priorityArray = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority: parseInt(priority),
      count: count
    }));
    
    setPriorityData(priorityArray);
  };

  const calculatePendingByImportance = (tasksData) => {
    const pendingCounts = {};
    // Filter for pending tasks (not completed)
    const pendingTasks = tasksData.filter(task => !task.completed);
    
    // Initialize counts for all importance levels (1-10)
    for (let i = 1; i <= 10; i++) {
      pendingCounts[i] = 0;
    }
    
    // Count pending tasks by importance
    pendingTasks.forEach(task => {
      const priority = task.importance || 0; // Default to 0 if undefined
      if (priority >= 1 && priority <= 10) {
        pendingCounts[priority] = (pendingCounts[priority] || 0) + 1;
      }
    });
    
    // Convert to array for recharts
    const pendingData = Object.entries(pendingCounts).map(([priority, count]) => ({
      importance: parseInt(priority),
      tasks: count
    }));
    
    setPendingByImportance(pendingData);
  };

  const getPriorityColor = (priority) => {
    if (priority >= 8) return 'var(--danger-red)';
    if (priority >= 6) return 'var(--warning-orange)';
    return 'var(--success-green)';
  };

  const getCompletionRateColor = (rate) => {
    if (rate >= 80) return 'var(--success-green)';
    if (rate >= 60) return 'var(--warning-orange)';
    return 'var(--danger-red)';
  };

  // Helper to format date in IST, DD/MM/YYYY, 24-hour
  const formatISTDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const year = istDate.getUTCFullYear();
    const hours = String(istDate.getUTCHours()).padStart(2, '0');
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Helper: Get day of week in Indian English
  const getDayName = (date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'long' });
  };

  // Helper: Get productivity insights for last 7 days
  const getProductivityInsights = () => {
    if (!tasks.length) return null;
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentTasks = tasks.filter(task => task.completed && task.completedAt && new Date(task.completedAt) >= sevenDaysAgo);
    if (!recentTasks.length) return null;

    // Count completions by day of week in the last 7 days
    const dayCounts = Array(7).fill(0);
    recentTasks.forEach(task => {
      const d = new Date(task.completedAt);
      dayCounts[d.getDay()]++;
    });
    const maxCount = Math.max(...dayCounts);
    const minCount = Math.min(...dayCounts);
    const mostProductiveDayIdx = dayCounts.indexOf(maxCount);
    const leastProductiveDayIdx = dayCounts.indexOf(minCount);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Weekday vs weekend in the last 7 days
    const weekdaySum = dayCounts.slice(1, 6).reduce((a, b) => a + b, 0);
    const weekendSum = dayCounts[0] + dayCounts[6];
    let trendMsg = '';
    if (weekdaySum > weekendSum) {
      trendMsg = 'You are more productive on weekdays than weekends in the last 7 days.';
    } else if (weekendSum > weekdaySum) {
      trendMsg = 'You are more productive on weekends than weekdays in the last 7 days.';
    } else {
      trendMsg = 'Your productivity is balanced across the week in the last 7 days.';
    }
    return {
      most: days[mostProductiveDayIdx],
      least: days[leastProductiveDayIdx],
      trendMsg
    };
  };

  // Helper: Get last N days with completion counts
  const getTopNDays = (n, order = 'desc') => {
    // Map: {dateString: count}
    const dateMap = {};
    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const d = new Date(task.completedAt);
        const dateStr = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
      }
    });
    const arr = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
    arr.sort((a, b) => order === 'desc' ? b.count - a.count : a.count - b.count);
    return arr.slice(0, n);
  };

  // Weekend vs Weekday
  const getWeekendWeekdayStats = () => {
    let weekday = 0, weekend = 0;
    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const d = new Date(task.completedAt);
        const day = d.getDay();
        if (day === 0 || day === 6) weekend++;
        else weekday++;
      }
    });
    return { weekday, weekend };
  };

  // Prepare data for recharts
  const lineChartData = weeklyData.map(day => ({
    name: day.day,
    Completed: day.completed
  }));

  const pieData = [
    { name: 'Completed', value: stats.completedTasks },
    { name: 'Pending', value: stats.pendingTasks },
    { name: 'Overdue', value: stats.overdueTasks }
  ];
  const pieColors = [NEON_GREEN, NEON_PURPLE, NEON_RED];

  // Most/least productive 7 days
  const most7 = getTopNDays(7, 'desc').sort((a, b) => new Date(a.date) - new Date(b.date));
  const least7 = getTopNDays(7, 'asc').sort((a, b) => new Date(a.date) - new Date(b.date));

  // Weekend vs Weekday
  const weekendWeekday = getWeekendWeekdayStats();
  const weekendWeekdayPie = [
    { name: 'Weekdays', value: weekendWeekday.weekday },
    { name: 'Weekends', value: weekendWeekday.weekend }
  ];

  // Prepare data for calendar heatmap
  const heatmapData = tasks.filter(t => t.completed && t.completedAt).map(t => {
    const d = new Date(t.completedAt);
    return { date: d.toISOString().slice(0, 10), count: 1 };
  });
  // Aggregate by date
  const dateMap = {};
  heatmapData.forEach(item => {
    dateMap[item.date] = (dateMap[item.date] || 0) + 1;
  });
  const calendarData = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
  // For calendar range
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 180);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
          <p className="dashboard-subtitle">Here's your productivity overview</p>
        </div>

        {/* Insights Section */}
        <div className="insights-section" style={{ marginBottom: 32 }}>
          <h3 className="section-title">Insights</h3>
          <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', textAlign: 'center' }}>
            {(() => {
              const insights = getProductivityInsights();
              if (!insights) return 'Start completing tasks to see your productivity insights from the last 7 days!';
              return (
                <>
                  <div>🌟 <b>Your most productive day:</b> {insights.most}</div>
                  <div>😴 <b>Your least productive day:</b> {insights.least}</div>
                  <div>📊 {insights.trendMsg}</div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalTasks}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.completedTasks}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pendingTasks}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <div className="stat-number">{stats.overdueTasks}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number" style={{ color: getCompletionRateColor(stats.completionRate) }}>
                {stats.completionRate}%
              </div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.currentStreak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{stats.averagePriority}/10</div>
              <div className="stat-label">Avg Priority</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.tasksCompletedToday}</div>
              <div className="stat-label">Completed Today</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3 className="chart-title">Weekly Productivity (Tasks Completed)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={NEON_BG} />
                <XAxis dataKey="name" stroke={NEON_GREEN} />
                <YAxis allowDecimals={false} stroke={NEON_GREEN} />
                <Tooltip contentStyle={{ background: NEON_BG, border: `1px solid ${NEON_GREEN}` }} labelStyle={{ color: NEON_GREEN }} />
                <Line type="monotone" dataKey="Completed" stroke={NEON_GREEN} strokeWidth={3} dot={{ r: 5, fill: NEON_GREEN }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Completion Rate</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: NEON_BG, border: `1px solid ${NEON_GREEN}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Pending Tasks by Importance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pendingByImportance} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={NEON_BG} />
                <XAxis dataKey="importance" stroke={NEON_GREEN} type="number" domain={[1, 10]} />
                <YAxis allowDecimals={false} stroke={NEON_GREEN} />
                <Tooltip contentStyle={{ background: NEON_BG, border: `1px solid ${NEON_GREEN}` }} labelStyle={{ color: NEON_GREEN }} />
                <Bar dataKey="tasks" fill={NEON_ORANGE} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Most Productive 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={most7} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={NEON_BG} />
                <XAxis dataKey="date" stroke={NEON_GREEN} />
                <YAxis allowDecimals={false} stroke={NEON_GREEN} />
                <Tooltip contentStyle={{ background: NEON_BG, border: `1px solid ${NEON_GREEN}` }} labelStyle={{ color: NEON_GREEN }} />
                <Bar dataKey="count" fill={NEON_GREEN} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Least Productive 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={least7} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={NEON_BG} />
                <XAxis dataKey="date" stroke={NEON_GREEN} />
                <YAxis allowDecimals={false} stroke={NEON_GREEN} />
                <Tooltip contentStyle={{ background: NEON_BG, border: `1px solid ${NEON_GREEN}` }} labelStyle={{ color: NEON_GREEN }} />
                <Bar dataKey="count" fill={NEON_PURPLE} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Weekend vs Weekday Productivity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={weekendWeekdayPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  <Cell fill={NEON_GREEN} />
                  <Cell fill={NEON_PURPLE} />
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: NEON_BG, border: `1px solid ${NEON_GREEN}` }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', color: 'var(--text-primary)', marginTop: 8, fontWeight: 600 }}>
              {weekendWeekday.weekday > weekendWeekday.weekend
                ? 'You are more productive on weekdays!'
                : weekendWeekday.weekend > weekendWeekday.weekday
                  ? 'You are more productive on weekends!'
                  : 'Your productivity is balanced across the week.'}
            </div>
          </div>
        </div>

        {/* Streak Calendar Section */}
        <div className="calendar-section" style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 24, marginBottom: 40, border: '1px solid var(--card-border)' }}>
          <h3 className="section-title">Streak Tracker</h3>
          <div style={{ width: '100%', maxWidth: '600px', height: '150px' }}>
            <CalendarHeatmap
              startDate={startDate}
              endDate={today}
              values={calendarData}
              classForValue={value => {
                if (!value) return 'color-empty';
                if (value.count >= 3) return 'color-github-4';
                if (value.count === 2) return 'color-github-3';
                if (value.count === 1) return 'color-github-2';
                return 'color-github-1';
              }}
              showWeekdayLabels={true}
              horizontal={true}
              gutterSize={2}
              monthSpacing={5}
            />
          </div>
          <style>{`
            .color-empty { fill: #222; }
            .color-github-1 { fill: #1a3a2a; }
            .color-github-2 { fill: #00ff88; }
            .color-github-3 { fill: #8b5cf6; }
            .color-github-4 { fill: #ef4444; }
          `}</style>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-list">
            {tasks
              .filter(task => task.completed && task.completedAt)
              .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
              .slice(0, 5)
              .map((task, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <div className="activity-text">Completed "{task.title}"</div>
                    <div className="activity-time">
                      {formatISTDateTime(task.completedAt)}
                    </div>
                  </div>
                  <div className="activity-priority" style={{ color: getPriorityColor(task.importance) }}>
                    Priority {task.importance}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="actions-grid">
            <button onClick={() => navigate(`/main/${username}`)} className="action-btn">
              <span className="action-icon">📝</span>
              <span>Add New Task</span>
            </button>
            <button onClick={() => navigate(`/main/${username}`)} className="action-btn">
              <span className="action-icon">📊</span>
              <span>View All Tasks</span>
            </button>
            <button onClick={() => navigate('/contact')} className="action-btn">
              <span className="action-icon">💬</span>
              <span>Get Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
