import React, {useEffect, useState} from 'react';
import './../styles/MonthSelector.css';

//get arrow
import {ReactComponent as ArrowSVG} from './../assets/arrow.svg';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const MonthSelector = ({month, gotoMonth}) => {
    const [currentMonth, setCurrentMonth] = useState(null);
    const [currentYear, setCurrentYear] = useState();

    // sets the current year when first mounted
    useEffect(() => {
        const year = new Date();
        setCurrentYear(year.getFullYear());
    }, []);

    // updates the month number
    useEffect(() => {
        if (month?.date) {
            setCurrentMonth(month.date.toDate().getMonth());
        } else {
            setCurrentMonth(getCurrentMonth());
        }
    }, [month]);

    // if the user is not logged or has logged out 
    // we want to display the current month
    const getCurrentMonth = () => {
        const today = new Date();
        return today.getMonth();
    }

    const handlePrevMonth = () => {
        console.log('Prev');
        if (currentMonth > 0) {
            //if the current month is NOT january
            gotoMonth({month: currentMonth-1, year: currentYear});
            setCurrentMonth(currentMonth-1);
        } else {
            //if the current month IS january
            gotoMonth({month: 11, year: currentYear-1});
            setCurrentMonth(11);
            setCurrentYear(currentYear-1);
        }
    }

    const handleNextMonth = () => {
        console.log('Next');
        if (currentMonth < 11) {
            //if the current month is NOT december
            gotoMonth({month: currentMonth+1, year: currentYear});
            setCurrentMonth(currentMonth+1);
        } else {
            //if the current month IS december
            gotoMonth({month: 0, year: currentYear+1});
            setCurrentYear(currentYear+1);
            setCurrentMonth(0);
        }
    }

    return(
        <div className="month-selector">
            <div onClick={handlePrevMonth} className="arrow month-selector__left-arrow">
                <ArrowSVG/>
            </div>
            <h2 className="arrow month-selector__month">{months[currentMonth]}</h2>
            <div onClick={handleNextMonth} className="month-selector__right-arrow">
                <ArrowSVG/>
            </div>
        </div>
    )
}

export default MonthSelector;
