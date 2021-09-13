import React, {useState} from 'react';
import { Timestamp } from 'firebase/firestore';

// import components
import TableContent from './TableContent';
import Appointment from './Appointment'

const SchedulesContainer = ({monthData, updateMonthData, isAuthenticated, setMonthData}) => {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState(undefined);

    // remove an appointment when the user clicks the remove button
    const handle_remove_appointment = (id, dayNumber) => {
        //console.log('remove: ', id, dayNumber);

        // get day that holds the date be removed
        let day;
        monthData.days.forEach( (d) => {
            if (d.date.toDate().getDate() === dayNumber) {
                day = d;
            }
        });

        //removes the appointment
        let newDayDates = [...day.dates.filter( (d) => d.id !== id )];

        //updates the db and the state
        setMonthData({
            date: monthData.date,
            days: [
                ...monthData.days.filter( (d) => d !== day ),
                {
                    date: day.date,
                    dates: newDayDates
                }
            ]
        });

    }

    const handle_edit_appointment = (id, year, month) => {
        console.log('edit: ', id);
    }

    //when the user clicks to submit a new appointment inside the appointments window
    const handle_submit_appointment = (newDate) => {
        //console.log('newDate! ', newDate);

        //error handling when the day hasn't been set
        if (!currentDay) return(console.log('Current day undefined when submitting the appointment'));

        // set the day to the selected one
        const to = new Date();
        const from = new Date();
        to.setDate(currentDay);
        from.setDate(currentDay);

        // set the time accordingly
        const [toHours, toMinutes] = newDate.to.split(':');
        const [fromHours, fromMinutes] = newDate.from.split(':');
        to.setHours(parseInt(toHours, 10));
        to.setMinutes(parseInt(toMinutes, 10));
        from.setHours(parseInt(fromHours, 10));
        from.setMinutes(parseInt(fromMinutes, 10));

        newDate.to = Timestamp.fromDate(to);
        newDate.from = Timestamp.fromDate(from);

        // sends data to parent to add the appointment
        updateMonthData(newDate);

        // close the window
        handle_toggle_appointment();
    }

    //toggle the show/hide state of the new appointment window
    const handle_toggle_appointment = () => {
        setIsAppointmentOpen(!isAppointmentOpen);
    }

    //when the user clicks outside the add appointment window while it's open, this will close it
    const handle_user_clicked_outside = () => {
        if (isAppointmentOpen) setIsAppointmentOpen(!isAppointmentOpen);
    }

    return(
        <div className="schedules-container">
            <div className="schedules-table">
                <div className="schedules__header">
                    <h3>Monday</h3>
                    <h3>Tuesday</h3>
                    <h3>Wednesday</h3>
                    <h3>Thursday</h3>
                    <h3>Friday</h3>
                    <h3>Saturday</h3>
                    <h3>Sunday</h3>
                </div>
                <div className="schedules__body">
                    <TableContent 
                        isAuthenticated={isAuthenticated}
                        monthData={monthData}
                        userClickedOutside={handle_user_clicked_outside}
                        setCurrentDay={(dayNumber) => {setCurrentDay(dayNumber)}}
                        setNewAppointment={handle_toggle_appointment}
                        removeAppointment={ (id, dayNumber) => {handle_remove_appointment(id, dayNumber)}}
                        editAppointment={handle_edit_appointment}
                    />
                    {isAppointmentOpen ? <Appointment
                        submit_callback={ (newDate) => {handle_submit_appointment(newDate)}}
                        close_window={handle_toggle_appointment}
                    /> : null}
                </div>
            </div>
        </div>
    )
}

export default SchedulesContainer;
