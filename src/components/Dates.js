import React, {Fragment} from 'react';
import { get_random_id, get_random_hsl, get_total_quarters_of_hours } from './helper_functions';

const Dates = ({dates, hours, setIsOpen, setNewAppointment}) => {
    const defaultMessage = 'No appointments this day 🙂';
    return(
        <Fragment>
            <button className="dates__btn btn-add" onClick={setNewAppointment}>
                <label htmlFor="btn" className="btn btn__label">Add appointment</label>
            </button>
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
                        key={get_random_id()}
                        style={{"gridRow": `${get_total_quarters_of_hours(date.from.toDate())} / span ${get_total_quarters_of_hours(date.to.toDate()) - get_total_quarters_of_hours(date.from.toDate())}`, "backgroundColor": `${get_random_hsl(50, 45)}` }} 
                        className="dates__date">{date.title}</li>)
                    })
                }
            </ul>
                : <label className="day__default-message">{defaultMessage}</label>}
        </Fragment>
    )
}

export default Dates;
