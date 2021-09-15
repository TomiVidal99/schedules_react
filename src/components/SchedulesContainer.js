import React, {useState} from 'react';
import {get_time_from_inputs} from './helper_functions';
import DateComponent from './DateComponent';

// import components
import TableContent from './TableContent';
import Appointment from './Appointment'

const SchedulesContainer = ({monthData, updateMonthData, isAuthenticated, setMonthData}) => {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState(undefined);
    const [dateData, setDateData] = useState(new DateComponent());
    const [isEditing, setIsEditing] = useState(false);

    // when the users submits and edited appointment
    const handle_edited_appointment = (editedDate) => {
        console.log('send is edited: ', editedDate);
        console.log('current day: ', currentDay);

        // creates the date object with the right formats and stores it in dateData
        dateData.setTitle(editedDate.title);
        dateData.setContent(editedDate.content);
        const [fromHours, fromMinutes] = get_time_from_inputs(editedDate.from);
        const [toHours, toMinutes] = get_time_from_inputs(editedDate.to);
        dateData.initializeFrom(currentDay, fromHours, fromMinutes);
        dateData.initializeTo(currentDay, toHours, toMinutes);
        dateData.toFirebaseDate();

        console.log('dateData: ', dateData.date);

        // updates the corresponding day
        let daysIndex, datesIndex;
        for (let i = 0; i < monthData.days.length; i++) {
            for (let j = 0; j < monthData.days[i].dates.length; j++) {
                if (monthData.days[i].dates[j].id === dateData.date.id) {
                    daysIndex = i;
                    datesIndex = j;
                }
            }
        }
        let newMonthData = monthData;
        Object.assign(newMonthData.days[daysIndex].dates[datesIndex], dateData.date);

        console.log({newMonthData});

        setMonthData({
            ...monthData,
            ...newMonthData
        });

        handle_toggle_appointment();

    }

    // remove an appointment when the user clicks the remove button
    const handle_remove_appointment = (id, dayNumber) => {
        console.log('remove: ', id, dayNumber);

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

        setCurrentDay(dayNum);

        // get the corresponding day of the month
        let day;
        monthData.days.forEach( (Day) => {
            if (Day.date.toDate().getDate() === dayNum) {
                day = Day;
                return;
            }
        });

        // get the corresponding date from day's dates
        day.dates.forEach( (date_) => {
            if (date_.id === id) {
                dateData.updateDate(date_);
            }
        } );

        if (!dateData.date.to) return(console.error('The date was not defined when trying to edit it.'))

        // updates on state
        setIsEditing(true);

        // opens the appointments menu
        handle_toggle_appointment();

        setDateData(dateData);
    }



    //when the user clicks to submit a new appointment inside the appointments window
    const handle_submit_appointment = (newDate) => {
        //console.log('newDate! ', newDate);

        console.log(newDate);

        dateData.updateDate(newDate);

        //error handling when the day hasn't been set
        if (!currentDay) return(console.log('Current day undefined when submitting the appointment'));

        const [toHours, toMinutes] = get_time_from_inputs(dateData.date.to);
        const [fromHours, fromMinutes] = get_time_from_inputs(dateData.date.from);

        // creates current day
        dateData.initializeTo(currentDay, toHours, toMinutes);
        dateData.initializeFrom(currentDay, fromHours, fromMinutes);
        dateData.toFirebaseDate();

        // sends data to parent to add the appointment
        updateMonthData(dateData.date);

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
                        setNewAppointment={() => {setIsEditing(false); handle_toggle_appointment()}}
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
            {/*
            TODO: remove this
            <button onClick={ () => {handle_submit_appointment({
                id: get_random_id(),
                title:'test',
                content:'test content',
                to: '10:30',
                from: '20:15'
            })}}>TEST</button>
            */}
        </div>
    )
}

export default SchedulesContainer;
