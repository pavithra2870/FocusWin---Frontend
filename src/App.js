import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Main from './Main';
import Navbar from './NavBar';
import { useAuth } from './AuthContext';
import LandingPage from './LandingPage';  
import Home from './Home';
import Contact from './Contact';
import Features from './Features';
import Dashboard from './Dashboard';

function App() {
  const { isLoggedIn, user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={isLoggedIn && user ? `/main/${user.name}` : '/main'} /> : <Login />} />
        <Route path="/main/:username" element={isLoggedIn ? <Main /> : <Navigate to="/login" />} />
        <Route path="/dashboard/:username" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;