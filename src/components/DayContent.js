import React  from 'react';
import { get_random_id } from './helper_functions';

// import components
import Dates from './Dates';

//some side components to make the code more readable and mantainable
const DayContent = ({ isAuthenticated, days, dayNumber, isOpen, setIsOpen, start_day_number, setNewAppointment, todayNumber, removeAppointment, editAppointment}) => {
    const classCalendarIsOpen = 'calendar-open';
    let currentDay = null;
    let iconWarning = null;
    const hours = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    if (days) {
        days.forEach( (day) => {
            if (day.date.toDate().getDate() === dayNumber && day.dates.length > 0) {
                // when the current day has data
                // TODO: depending on how far the date is, set different icons
                iconWarning = ' icon-warning';
                // sets the data of the current day
                currentDay = day;
            }
        } ); 
    }

    //when a day in the calendar is clicked
    const handle_calendar_day_click = () => {
        if (!isOpen) setIsOpen(dayNumber, !isOpen);
    }

    return(
        <time
            key={get_random_id()+dayNumber} 
            className={'calendar__day'.concat(
                (dayNumber === 1 ? ' calendar-'+(start_day_number).toString() : ''),
                ( isOpen ? (' ').concat(classCalendarIsOpen) : ''),
                (iconWarning ? iconWarning : ''),
                (todayNumber === dayNumber ? ' calendar__today' : '')
            )}
            onClick={handle_calendar_day_click}
        >
            <label className='day__number' after-content={dayNumber === 1 ? 'st' : (dayNumber === 2 ? 'nd' : (dayNumber === 3 ? 'rd' : 'th'))}>
                {dayNumber}
            </label>
            {isOpen ? 
                    <Dates 
                        isAuthenticated={isAuthenticated}
                        setIsOpen={setIsOpen}
                        dates={currentDay ? currentDay.dates : null}
                        hours={hours}
                        setNewAppointment={setNewAppointment} 
                        removeAppointment={(id) => {removeAppointment(id, dayNumber)}}
                        editAppointment={editAppointment}
                    /> 
                    : null}
        </time>
    )
}

export default DayContent;
