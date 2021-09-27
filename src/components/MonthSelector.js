import React from 'react';
import './../styles/MonthSelector.css';

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

const MonthSelector = ({month}) => {
    return(
        <div className="month-selector">
            <div className="month-selector__left-arrow"></div>
            <h2 className="month-selector__month">{month?.date ? months[month.date.toDate().getMonth()] : null}</h2>
            <div className="month-selector__right-arrow"></div>
        </div>
    )
}

export default MonthSelector;
