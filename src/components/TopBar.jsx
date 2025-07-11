import { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onAddTask, viewMode, setViewMode }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, logout, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        if (showProfile) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfile]);

    if (loading) return null; // or a spinner

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Toggle button style
    const toggleBtn = (active) => ({
        background: active ? 'var(--color-primary)' : 'var(--color-card)',
        color: active ? '#fff' : 'var(--color-text)',
        border: 'none',
        borderRadius: 8,
        padding: '0.5rem 1.1rem',
        fontWeight: 600,
        cursor: 'pointer',
        marginRight: 4,
        transition: 'background 0.2s',
    });

    return (
        <nav className="top-bar">
            <button>Today</button>
            <div className="toggle-group">
                <button style={toggleBtn(viewMode === 'day')} onClick={() => setViewMode('day')}>Day</button>
                <button style={toggleBtn(viewMode === 'list')} onClick={() => setViewMode('list')}>List</button>
            </div>
            <button onClick={toggleTheme} title="Toggle theme" style={{ marginLeft: 8 }}>
                {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            {/* Move the Add Task button here, just before the profile icon */}
            <button className="plus-btn" onClick={onAddTask}>+</button>
            <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                    className="profile-icon"
                    style={{ cursor: 'pointer', zIndex: 200 }}
                    onClick={() => { console.log('Profile clicked'); setShowProfile((v) => !v); }}
                    title="Profile"
                >
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </button>
                {showProfile && (
                    <div
                        className="profile-dropdown"
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '120%',
                            background: 'var(--color-card)',
                            color: 'var(--color-text)',
                            borderRadius: 12,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            minWidth: 220,
                            zIndex: 100,
                            padding: '1.2rem 1.5rem 1rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 8,
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 2 }}>{user.name || user.email}</div>
                        <div style={{ fontSize: '0.98rem', color: 'var(--color-primary)', marginBottom: 10 }}>{user.email}</div>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'var(--color-primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '0.6rem 1.2rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: 8,
                                width: '100%',
                            }}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopBar; 