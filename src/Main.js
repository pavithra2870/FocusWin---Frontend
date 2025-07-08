import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

function Main() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const [tasksRes, groupsRes] = await Promise.all([
          axios.get('/api/tasks', { headers: { userId: user.id } }),
          axios.get('/api/groups', { headers: { userId: user.id } }),
        ]);
        setTasks(tasksRes.data);
        setGroups(groupsRes.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          alert('Please log in again.');
        }
      }
    };

    fetchAll();
  }, [user, logout]);

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
      <div>
        <h2>Tasks</h2>
        {tasks.map(task => <div key={task._id}>{task.title}</div>)}
      </div>
      <div>
        <h2>Groups</h2>
        {groups.map(group => <div key={group._id}>{group.name}</div>)}
      </div>
    </div>
  );
}

export default Main;
