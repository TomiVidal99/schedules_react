import React, {Fragment, useState} from 'react';
import { get_random_id, get_random_hsl, get_total_quarters_of_hours, parse_date } from './helper_functions';

const Dates = ({isAuthenticated, dates, hours, setIsOpen, setNewAppointment, removeAppointment, editAppointment}) => {
    const defaultMessageAuth = 'No appointments this day 🙂';
    const defaultMessageNoAuth = 'To add new appointments log in please. Thank you';
    const [isClicked, setIsClicked] = useState(false);

    return(
        <Fragment>
            { isAuthenticated ? 
                <button className="dates__btn btn-add" onClick={setNewAppointment}>
                    <label htmlFor="btn" className="btn btn__label">Add appointment</label>
                </button>
                : null
            }
            <button className="dates__btn btn-close" onClick={() => {setIsOpen(false)}}></button>
            { dates ? 
                <ul key={get_random_id()} className="day__dates">
                    {
                        dates ? hours.map( (hour) => {
                            return(<div key={get_random_id()} className="day__hour"></div>)
                        }) : null
                    }
                    {
                        dates.map( (date) => {
                            return(<li 
                            onClick={() => {setIsClicked(!isClicked)}}
                            key={get_random_id()}
                            style={{"gridRow": `${get_total_quarters_of_hours(date.from.toDate())} / span ${get_total_quarters_of_hours(date.to.toDate()) - get_total_quarters_of_hours(date.from.toDate())}`, "backgroundColor": `${get_random_hsl(50, 45)}` }} 
                            onDoubleClick={() => {editAppointment(date.id)}}
                            className={isClicked ? 'dates__date dates__date-clicked' : 'dates__date'}>
                                    <div className="date__container">
                                        <button onClick={() => {removeAppointment(date.id)}} className="date__btn date__delete-btn"><img className="btn-image" alt="remove appointment" src={process.env.PUBLIC_URL+'trash-icon.svg'}/></button>
                                        <h5 className="date__title">
                                            {date.title}
                                        </h5>
                                        <p before-content={date.content === '' ? '' : '🗒'} className="date__content">{date.content}</p>
                                        <div className="date__time-container">
                                            <time dateTime={date.from.toDate()}>{`From: ${parse_date(date.from.toDate())}`}</time>
                                            <time dateTime={date.to.toDate()}>{`To: ${parse_date(date.to.toDate())}`}</time>
                                        </div>
                                        <button onClick={ () => {editAppointment(date.id)}} className="date__btn date__edit-btn"><img className="btn-image" alt="edit appointment" src={process.env.PUBLIC_URL+'edit-icon.svg'}/></button>
                                    </div>
                                </li>)
                        })
                    }
                </ul>
                    : <label className="day__default-message">{isAuthenticated ? defaultMessageAuth : defaultMessageNoAuth}</label>}
        </Fragment>
    )
}

export default Dates;
