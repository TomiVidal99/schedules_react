import React, {useState} from 'react';
import {Date} from './../classes/Date';

// import components
import TableContent from './TableContent';
import Appointment from './Appointment'

const SchedulesContainer = ({monthData, updateMonthData, isAuthenticated, setMonthData}) => {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState(undefined);
    const [dateData, setDateData] = useState(new Date);
    const [isEditing, setIsEditing] = useState(false);

    // when the users submits and edited appointment
    const handle_edited_appointment = (editedDate) => {

        setIsEditing(false);
    }

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

    const handle_edit_appointment = (id, dayNum) => {
        //console.log('edit, id: ', id);
        //console.log('day: ', dayNum);

        // get the corresponding day of the month
        let day;
        monthData.days.forEach( (Day) => {
            if (Day.date.toDate().getDate() === dayNum) {
                day = Day;
                return;
            }
        });
        //console.log({day});

        // get the corresponding date from day's dates
        day.dates.forEach( (Date) => {
            if (Date.id === id) {
                dateData.updateDate(Date);
            }
        } );
        console.log({dateData});

        /*

        // parse the date's data to math inputs data
        const parsedDate = helper_from_firebase_date(date);
        date = {...date, ...parsedDate};
        const parsedTimes = helper_from_date_to_input(date);
        date = {...date, ...parsedTimes};

        // updates on state
        setDateData(date);
        setIsEditing(true);
        */

        // opens the appointments menu
        handle_toggle_appointment();

    }



    //when the user clicks to submit a new appointment inside the appointments window
    const handle_submit_appointment = (newDate) => {
        //console.log('newDate! ', newDate);

        dateData.updateDate(newDate);

        //error handling when the day hasn't been set
        if (!currentDay) return(console.log('Current day undefined when submitting the appointment'));

        const [toHours, toMinutes] = helper_parse_num_from_inputs(newDate.to);
        const [fromHours, fromMinutes] = helper_parse_num_from_inputs(newDate.from);

        const to = helper_new_day_date(currentDay, toHours, toMinutes);
        const from = helper_new_day_date(currentDay, fromHours, fromMinutes);

        helper_update_time(to, toHours, toMinutes);
        helper_update_time(from, fromHours, fromMinutes);
        newDate = {
            ...newDate,
            to: to,
            from: from
        };

        newDate = {...newDate, ...helper_to_firebase_date(newDate)};

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
                        editAppointment={(day, id) => {handle_edit_appointment(day, id)}}
                    />
                    {isAppointmentOpen ? <Appointment
                        submit_callback={handle_submit_appointment}
                        edited_callback={handle_edited_appointment}
                        close_window={handle_toggle_appointment}
                        dateData={dateData}
                        isEditing={isEditing}
                    /> : null}
                </div>
            </div>
        </div>
    )
}

export default SchedulesContainer;
