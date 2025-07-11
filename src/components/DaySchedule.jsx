import TaskCard from './TaskCard';

const DaySchedule = ({ tasks = [], onEdit, onDelete, showStatus }) => {
    // Example: 24 hourly slots
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    // Group tasks by hour
    const tasksByHour = hours.reduce((acc, hour) => {
        acc[hour] = tasks.filter(task => {
            const slotHour = hour.slice(0, 2);
            // Prefer startTime, fallback to time for legacy tasks
            const taskHour = (task.startTime || task.time || '').slice(0, 2);
            return taskHour === slotHour;
        });
        return acc;
    }, {});

    return (
        <div className="day-schedule">
            <h3>Hourly Schedule</h3>
            <div className="hourly-slots">
                {hours.map(hour => (
                    <div className="hour-slot" key={hour}>
                        <span style={{ minWidth: 48, fontWeight: 500 }}>{hour}</span>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {tasksByHour[hour] && tasksByHour[hour].map(task => (
                                <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} showStatus={showStatus} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DaySchedule; 