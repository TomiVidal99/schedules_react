import React, {useEffect, useState, useRef} from 'react';
import {get_random_id} from './helper_functions';

const Appointment = ({submit_callback, edited_callback, close_window, dateData, isEditing}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [toInput, setToInput] = useState(undefined);
    const [fromInput, setFromInput] = useState(undefined);
    const [canSendData, setCanSetData] = useState(false);
    const inputFromRef = useRef();
    const inputToRef = useRef();

    const newAppointmentMessage = 'Add a new appointment';
    const editAppointmentMessage = 'Edit appointment';

    //populate the data of the inputs when the users wants to edit date
    useEffect( () => {

        if (!isEditing) {
            setToInput('00:00');
            setFromInput('00:00');
        } else {
            const {title, content, to, from} = dateData.date;
            setTitle(title);
            setContent(content);
            const toTime = `${to.toDate().getHours() < 10 ? '0' : ''}${to.toDate().getHours()}:${to.toDate().getMinutes() < 10 ? '0' : ''}${to.toDate().getMinutes()}`;
            const fromTime = `${from.toDate().getHours() < 10 ? '0' : ''}${from.toDate().getHours()}:${from.toDate().getMinutes() < 10 ? '0' : ''}${from.toDate().getMinutes()}`;

            // updates the inputs values: TODO: (BUG) for some reason the state wont do it???
            // These two lines would be if the state would of update it:
            //--------------
            setFromInput(fromTime);
            setToInput(toTime);
            //---------------

            inputFromRef.current.value = fromTime;
            inputToRef.current.value = toTime;

        }

    }, [dateData]);

    //triggered when the user clicks send data
    const handle_submit_date = () => {
        const newDate = {
            title: title,
            content: content,
            from: fromInput,
            to: toInput,
            id: get_random_id()
        };
        if (isEditing) {
            // when the users is editing the date dont create a new one
            edited_callback(newDate);
        } else {
            // when the user submits an edited date
            submit_callback(newDate);
        }
    }

    //check every time the input data changes if the data can be used
    useEffect(() => {

        //check if the user has set a title 
        if (title === '') {
            setCanSetData(false);
            return;
        }

        //check if the time set is valid
        if (!fromInput || !toInput) return;
        const [fromHour, fromMin] = fromInput.split(':');
        const [toHour, toMin] = toInput.split(':');

        //case when the from hour is ahead of the to hour
        if (parseInt(toHour, 10) < parseInt(fromHour, 10)) {
            setCanSetData(false);
            return;
        }

        //case when the hour is the same
        if (parseInt(toHour, 10) === parseInt(fromHour, 10) && parseInt(toMin, 10) <= (parseInt(fromMin, 10)+20) ) {
            setCanSetData(false);
            return;
        }

        //set the button to be able to send the data
        setCanSetData(true);

    }, [toInput, fromInput, title]);

    const handle_title_change = (e) => {
        const val = e.target.value;
        setTitle(val);
    }
    const handle_content_change = (e) => {
        const val = e.target.value;
        setContent(val);
    }
    const handle_from_update = (e) => {
        const val = e.target.value;
        //console.log(val);
        setFromInput(val);
    }
    const handle_to_update = (e) => {
        const val = e.target.value;
        //console.log(val);
        setToInput(val);
    }

    return(
        <section className="schedules__new-date" >
            <div className="new-date__header">
                <h6 className="new-date__title">{isEditing ? editAppointmentMessage : newAppointmentMessage}</h6>
                <button className="btn new-date__btn-close" onClick={close_window}></button>
            </div>
            <fieldset className="new-date__fieldset">
                <legend className="fieldset__legend">Date</legend>
                <label className="fieldset__label" htmlFor="title">
                    Title:<input value={title} onChange={ (e) => {handle_title_change(e)}} className="fieldset__input" type="text" id="title" name="title" />
                </label>
                <label className="fieldset__label" htmlFor="content">
                    Content:<textarea value={content} onChange={(e) => {handle_content_change(e)}} className="fieldset__input" type="textbox" id="content" name="content" />
                </label>
                <label className="fieldset__label" htmlFor="from">
                    From:<input ref={inputFromRef} onChange={(e) => {handle_from_update(e)}} className="fieldset__input" type="time" id="from" name="from" step="900" />
                </label>
                <label className="fieldset__label" htmlFor="to">
                    To:<input ref={inputToRef} onChange={(e) => {handle_to_update(e)}} className="fieldset__input" type="time" id="to" name="to" step="900" />
                </label>
                {!canSendData ? <label className="disabled-bt-description">More information required.</label> : null}
                <button disabled={!canSendData} className="btn fieldset__btn-add" onClick={handle_submit_date}>{isEditing ? 'Update' : 'Add'}</button>
            </fieldset>
        </section>
    )
}

export default Appointment;
