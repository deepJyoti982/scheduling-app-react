import { FaEdit, FaTrash } from 'react-icons/fa';

const formatDateTime = (dateStr, startTime, endTime) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const datePart = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    let timePart = '';
    if (startTime && endTime) timePart = `${startTime} - ${endTime}`;
    else if (startTime) timePart = startTime;
    else if (endTime) timePart = endTime;
    return timePart ? `${datePart} | ${timePart}` : datePart;
};

const TaskCard = ({ task, onEdit, onDelete, showDetails, showStatus }) => {
    return (
        <div className="task-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 18px', minHeight: 64, background: 'var(--color-card, #fff)', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: 0, fontWeight: 600, fontSize: '1.08rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</h4>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.98em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.description}</p>
                {showDetails && (
                    <div style={{ marginTop: 4, fontSize: '0.97em', color: '#444', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ color: '#4f8cff', fontWeight: 500 }}>{formatDateTime(task.dueDate, task.startTime, task.endTime)}</span>
                        {task.status && <span style={{ color: '#e67e22', fontWeight: 600, textTransform: 'capitalize', letterSpacing: 0.2 }}>{task.status.replace('_', ' ')}</span>}
                    </div>
                )}
                {showStatus && task.status && (
                    <div style={{ marginTop: 4, fontSize: '0.97em', color: '#e67e22', fontWeight: 600, textTransform: 'capitalize', letterSpacing: 0.2 }}>
                        {task.status.replace('_', ' ')}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', marginLeft: 12 }}>
                {onEdit && (
                    <button
                        onClick={() => onEdit(task)}
                        title="Edit Task"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 6,
                            borderRadius: '50%',
                            transition: 'background 0.2s',
                            color: '#4f8cff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(79,140,255,0.08)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                        <FaEdit size={16} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(task)}
                        title="Delete Task"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 6,
                            borderRadius: '50%',
                            transition: 'background 0.2s',
                            color: '#e74c3c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(231,76,60,0.08)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                        <FaTrash size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard; 