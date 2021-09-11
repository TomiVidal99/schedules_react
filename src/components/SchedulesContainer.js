import React, {useState} from 'react';

// import components
import TableContent from './TableContent';
import Appointment from './Appointment'

const SchedulesContainer = ({monthData, updateMonthData}) => {
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

    //when the user clicks to submit a new appointment inside the appointments window
    const handle_submit_appointment = (newDate) => {
        console.log('newDate! ', newDate);
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
                        monthData={monthData}
                        setNewAppointment={handle_toggle_appointment}
                        userClickedOutside={handle_user_clicked_outside}
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
