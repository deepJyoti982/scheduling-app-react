import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const TaskFilters = ({ tasks = [] }) => {
    const { user } = useContext(UserContext);
    // Compute counts
    const allCount = tasks.length;
    const myTasksCount = user ? tasks.filter(task => task.createdBy && task.createdBy._id === user._id).length : 0;
    const delegatedCount = tasks.filter(task => task.type === 'delegated').length;
    const meetingCount = tasks.filter(task => task.type === 'meeting').length;

    // Badge style
    const badgeStyle = {
        background: '#ff5c5c',
        color: '#fff',
        borderRadius: '999px',
        fontSize: '0.8em',
        padding: '2px 8px',
        marginLeft: 6,
        fontWeight: 600,
        display: 'inline-block',
        minWidth: 22,
        textAlign: 'center',
    };

    return (
        <div className="task-filters">
            <button>All <span style={badgeStyle}>{allCount}</span></button>
            <button>My Tasks <span style={badgeStyle}>{myTasksCount}</span></button>
            <button>Delegated Task <span style={badgeStyle}>{delegatedCount}</span></button>
            <button>Meeting <span style={badgeStyle}>{meetingCount}</span></button>
            {/* Add more filters as needed */}
        </div>
    );
};

export default TaskFilters; 