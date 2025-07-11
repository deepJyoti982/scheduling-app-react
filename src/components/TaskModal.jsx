import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaUserPlus } from 'react-icons/fa';

const COLORS = [
    { value: 'Red', color: '#fca5a5' },
    { value: 'Green', color: '#86efac' },
    { value: 'Blue', color: '#93c5fd' },
    { value: 'Yellow', color: '#fde68a' },
];
const PRIORITIES = ['low', 'medium', 'high'];
const RECURRENCE = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
];
const REMINDER_OPTIONS = [
    { value: '5m', label: '5 minutes before' },
    { value: '15m', label: '15 minutes before' },
    { value: '30m', label: '30 minutes before' },
    { value: '1h', label: '1 hour before' },
    { value: '1d', label: '1 day before' },
];

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
];

const API_URL = import.meta.env.VITE_API_URL;

const TaskModal = ({ open, onClose, onSubmit, defaultDate, editingTask, mode = 'create' }) => {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [priority, setPriority] = useState('medium');
    const [company, setCompany] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [manualEmail, setManualEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [recurrence, setRecurrence] = useState('none');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
    const [reminders, setReminders] = useState([]);
    const [color, setColor] = useState('Red');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && editingTask) {
                setTitle(editingTask.title || '');
                setDescription(editingTask.description || '');
                setDate(editingTask.dueDate ? new Date(editingTask.dueDate).toLocaleDateString('en-CA') : (defaultDate ? defaultDate.toLocaleDateString('en-CA') : ''));
                setStartTime(editingTask.startTime || '');
                setEndTime(editingTask.endTime || '');
                setPriority(editingTask.priority || 'medium');
                setCompany(editingTask.company || '');
                setAssignedTo(editingTask.assignedTo && editingTask.assignedTo[0] ? (editingTask.assignedTo[0]._id || editingTask.assignedTo[0].id || editingTask.assignedTo[0].email) : '');
                setManualEmail('');
                setRecurrence(editingTask.recurrence || 'none');
                setRecurrenceEndDate(editingTask.recurrenceEndDate ? new Date(editingTask.recurrenceEndDate).toLocaleDateString('en-CA') : '');
                setReminders(editingTask.reminders || []);
                setColor(editingTask.color || 'Red');
                setStatus(editingTask.status || 'pending');
            } else if (defaultDate) {
                setTitle(''); setDescription(''); setDate(defaultDate.toLocaleDateString('en-CA'));
                setStartTime(''); setEndTime(''); setPriority('medium'); setCompany(''); setAssignedTo(''); setManualEmail(''); setRecurrence('none'); setRecurrenceEndDate(''); setReminders(['5m', '15m', '30m']); setColor('Red'); setStatus('pending');
            }
        }
    }, [open, mode, editingTask, defaultDate]);

    useEffect(() => {
        if (open) {
            fetch(`${API_URL}/api/users/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then(res => res.ok ? res.json() : [])
                .then(data => setUsers(data))
                .catch(() => setUsers([]));
        }
    }, [open]);

    if (!open) return null;

    const handleAddAssignee = () => {
        if (manualEmail && !users.some(u => u.email === manualEmail)) {
            setUsers(prev => [...prev, { email: manualEmail, id: manualEmail }]);
            setAssignedTo(manualEmail);
            setManualEmail('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit({
                ...(mode === 'edit' ? { _id: editingTask._id } : {}),
                title,
                description,
                date,
                startTime,
                endTime,
                priority,
                company,
                assignedTo: assignedTo ? [assignedTo] : [],
                recurrence,
                recurrenceEndDate,
                reminders,
                color,
                createdBy: user?.id,
                status,
            });
            setTitle(''); setDescription(''); setDate(''); setStartTime(''); setEndTime(''); setPriority('medium'); setCompany(''); setAssignedTo(''); setManualEmail(''); setRecurrence('none'); setRecurrenceEndDate(''); setReminders(['5m', '15m', '30m']); setColor('Red'); setStatus('pending');
            onClose();
        } catch (err) {
            setError(mode === 'edit' ? 'Failed to update task' : 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    // Generate time options (00:00 to 23:00)
    const timeOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>{mode === 'edit' ? 'Edit Event' : 'Create Event'}</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} />
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    {/* Status field */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}>Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} required>
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Assignee section */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}><FaUserPlus style={{ marginRight: 6 }} /> Assign to One Person</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                        <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ flex: 1 }}>
                            <option value="">Select a registered user</option>
                            {users.map(u => <option key={u.id || u._id || u.email} value={u.id || u._id || u.email}>{u.email}</option>)}
                        </select>
                        <button type="button" onClick={() => setAssignedTo(assignedTo)} style={{ padding: '0.5rem 1rem' }}>Add</button>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <input
                            type="email"
                            value={manualEmail}
                            onChange={e => setManualEmail(e.target.value)}
                            placeholder="Add email manually"
                            style={{ marginRight: 8 }}
                        />
                        <button type="button" onClick={handleAddAssignee}>Add email manually</button>
                    </div>

                    {/* Start Time */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}>Start Time</label>
                    <select value={startTime} onChange={e => setStartTime(e.target.value)} required>
                        <option value="">Select time</option>
                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* End Time */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}>End Time</label>
                    <select value={endTime} onChange={e => setEndTime(e.target.value)} required>
                        <option value="">Select time</option>
                        {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Repeat */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}>Repeat</label>
                    <select value={recurrence} onChange={e => setRecurrence(e.target.value)}>
                        {RECURRENCE.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {recurrence !== 'none' && (
                        <input type="date" value={recurrenceEndDate} onChange={e => setRecurrenceEndDate(e.target.value)} placeholder="Recurrence End Date" />
                    )}

                    {/* Reminders */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}>Reminders</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                        {REMINDER_OPTIONS.map(opt => (
                            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input
                                    type="checkbox"
                                    checked={reminders.includes(opt.value)}
                                    onChange={e => {
                                        if (e.target.checked) setReminders(r => [...r, opt.value]);
                                        else setReminders(r => r.filter(v => v !== opt.value));
                                    }}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>

                    {/* Color Picker */}
                    <label style={{ fontWeight: 600, marginTop: 8 }}>Color</label>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        {COLORS.map(c => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setColor(c.value)}
                                style={{
                                    width: 32, height: 32, borderRadius: '50%', border: color === c.value ? '3px solid var(--color-primary)' : '2px solid #ccc',
                                    background: c.color, cursor: 'pointer', outline: 'none',
                                }}
                                aria-label={c.value}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, background: 'none', border: '1.5px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 8, padding: '0.7rem 0' }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 600 }}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default TaskModal; 