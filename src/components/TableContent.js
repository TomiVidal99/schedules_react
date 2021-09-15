import React, {Fragment, useEffect, useState} from "react";

// import components
import DayContent from './DayContent';
import { get_days_of_month, get_random_id } from "./helper_functions";

const TableContent = ({isAuthenticated, monthData, setNewAppointment, userClickedOutside, setCurrentDay, removeAppointment, editAppointment}) => {
    const currentDate = new Date();
    const currentYear = currentDate.getYear();
    const currentMonth = currentDate.getMonth();
    const start_day = new Date(currentYear, currentMonth, 1);
    const start_day_number = start_day.getDay()+2;
    const totalDays = get_days_of_month(currentMonth, currentYear)
    const [days, setDays] = useState([]);

    // create the inital calendar days based on the days that the current month has
    useEffect(() => {
        let DAYS = [];
        for (let i = 1; i <= totalDays; i++) {
            DAYS.push({
                number: i,
                isOpen: false
            });
        }
        setDays([...DAYS]);
    }, [monthData]);

    //expand the correct calendar day 
    const updateDayState = (dayNumber, isOpenState) => {
        let newDays = days;
        newDays.forEach( (day) => {day.isOpen = false});
        if (isOpenState) newDays[dayNumber-1].isOpen = isOpenState;
        setDays([...newDays]);

        // store on the parent's component the lastest day clicked to use it later
        setCurrentDay(dayNumber);

        // close the appointment window if the user clicked another day or closed the window
        userClickedOutside();
    }

    return(
        <Fragment>
            {
                days.map( (day) => {
                    return(
                        <DayContent
                            isAuthenticated={isAuthenticated}
                            key={get_random_id()}
                            days={monthData ? monthData.days : null}
                            dayNumber={day.number}
                            isOpen={day.isOpen}
                            setIsOpen={(dayNumber, newState) => {updateDayState(dayNumber, newState)}}
                            start_day_number={start_day_number}
                            setNewAppointment={setNewAppointment}
                            todayNumber={currentDate.getDate()}
                            removeAppointment={ (id, dayNumber) => {removeAppointment(id, dayNumber)}}
                            editAppointment={(id, dayNumber) => {editAppointment(id, dayNumber)}}
                        />)
                        
                } )
            }
        </Fragment>
    )
}

export default TableContent;
