import './App.css';
import TopBar from './components/TopBar';
import TaskFilters from './components/TaskFilters';
import CalendarStrip from './components/CalendarStrip';
import DaySchedule from './components/DaySchedule';
import TaskModal from './components/TaskModal';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { useState, useEffect } from 'react';
import TaskCard from './components/TaskCard';

const API_URL = import.meta.env.VITE_API_URL;

// Helper to format date as YYYY-MM-DD in local time
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'list'
  const [editingTask, setEditingTask] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    if (viewMode === 'day' && selectedDate) {
      const dateStr = formatDateLocal(selectedDate);
      fetch(`${API_URL}/api/tasks/by-date?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setTasks(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (viewMode === 'list') {
      fetch(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setTasks(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isAuthenticated, selectedDate, viewMode]);

  // Handle task creation
  const handleCreateTask = async (formData) => {
    const { date } = formData;
    const body = {
      ...formData,
      dueDate: date || formatDateLocal(selectedDate),
    };
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      // Refresh tasks
      setLoading(true);
      const dateStr = formatDateLocal(selectedDate);
      fetch(`${API_URL}/api/tasks/by-date?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setTasks(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      throw new Error('Failed to create task');
    }
  };

  // Handle task update
  const handleUpdateTask = async (formData) => {
    const { date, _id } = formData;
    const body = {
      ...formData,
      dueDate: date || formatDateLocal(selectedDate),
    };
    const res = await fetch(`${API_URL}/api/tasks/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      // Refresh tasks
      setLoading(true);
      const dateStr = formatDateLocal(selectedDate);
      const url = viewMode === 'day'
        ? `${API_URL}/api/tasks/by-date?date=${dateStr}`
        : `${API_URL}/api/tasks`;
      fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setTasks(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      throw new Error('Failed to update task');
    }
  };

  // Handle delete
  const handleDeleteTask = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    await fetch(`${API_URL}/api/tasks/${task._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    // Refresh tasks
    const dateStr = formatDateLocal(selectedDate);
    const url = viewMode === 'day'
      ? `${API_URL}/api/tasks/by-date?date=${dateStr}`
      : `${API_URL}/api/tasks`;
    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Open modal for edit
  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Modal close handler
  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTask(null);
    setModalMode('create');
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <div className="app-container">
                    <TopBar onAddTask={() => { setModalOpen(true); setModalMode('create'); setEditingTask(null); }} viewMode={viewMode} setViewMode={setViewMode} />
                    <TaskFilters tasks={tasks} />
                    <CalendarStrip selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    <main>
                      {loading ? (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>Loading tasks...</div>
                      ) : (
                        viewMode === 'day' ? (
                          <DaySchedule tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} showStatus={viewMode === 'day'} />
                        ) : (
                          <div className="task-list-view" style={{ display: 'flex', flexDirection: 'column', gap: 18, margin: '24px 0' }}>
                            {tasks.length === 0 ? (
                              <div style={{ textAlign: 'center', marginTop: 40 }}>No tasks found.</div>
                            ) : (
                              tasks.map(task => (
                                <TaskCard
                                  key={task._id}
                                  task={task}
                                  onEdit={handleEditTask}
                                  onDelete={handleDeleteTask}
                                  showDetails={viewMode === 'list'}
                                />
                              ))
                            )}
                          </div>
                        )
                      )}
                    </main>
                    <TaskModal
                      open={modalOpen}
                      onClose={handleModalClose}
                      onSubmit={modalMode === 'edit' ? handleUpdateTask : handleCreateTask}
                      defaultDate={selectedDate}
                      editingTask={editingTask}
                      mode={modalMode}
                    />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
