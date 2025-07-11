import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarStrip = ({ selectedDate, setSelectedDate }) => {
    return (
        <div className="calendar-strip">
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                    if (view === 'month' && date.toDateString() === new Date().toDateString()) {
                        return 'today';
                    }
                    if (view === 'month' && date.toDateString() === selectedDate.toDateString()) {
                        return 'selected';
                    }
                    return null;
                }}
            />
        </div>
    );
};

export default CalendarStrip; 