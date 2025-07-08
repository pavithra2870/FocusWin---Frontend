import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('https://focuswin.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      login(data);
      navigate(`/main/${data.name}`);
    } else {
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card-neon">
        <h2 className="auth-title">Create your account</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <span className="auth-input-icon">👤</span>
            <input className="auth-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required autoFocus />
          </div>
          <div className="auth-input-group">
            <span className="auth-input-icon">📧</span>
            <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-input-group">
            <span className="auth-input-icon">🔒</span>
            <input className="auth-input" type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <span className="auth-input-icon auth-eye" onClick={() => setShowPassword(v => !v)} style={{ cursor: 'pointer' }}>{showPassword ? '🙈' : '👁️'}</span>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
        <div className="auth-switch-text">
          Already have an account?{' '}
          <a href="/login" className="auth-switch-link">Login</a>
        </div>
      </div>
    </div>
  );
}
export default Signup;
