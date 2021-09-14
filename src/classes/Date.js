import {get_random_id, get_time_from_inputs} from './../components/helper_functions';
import {Timestamp} from 'firebase/firestore/';

class Date {
    constructor() {
        this.date = {
            id: get_random_id(),
            title: '',
            content: '',
            to: undefined,
            from: undefined,
        }
    }

    setTitle = (title) => {
        this.date.title = title;
    }

    setTitle = (content) => {
        this.date.content = content;
    }

    // updates all the date on a date
    updateDate = (date) => {
        this.date = {
            ...this.date,
            ...date
        }
    }

    // parse date time to string that matches inputs data format
    //helper_from_date_to_input = (date) => {
    dateToInput = () => {
        const {to, from} = this.date;
        const toParsed = `${to.getHours()}:${to.getMinutes() < 10 ? '0' : ''}${to.getMinutes()}`;
        const fromParsed = `${from.getHours()}:${from.getMinutes() < 10 ? '0' : ''}${from.getMinutes()}`;
        this.date = {
            ...this.date,
            to: toParsed,
            from: fromParsed
        };
    }

    //converts the dates on a date into Timestamp date
    toFirebaseDate = () => {
        this.date = {
            ...this.date,
            to: Timestamp.fromDate(this.date.to),
            from: Timestamp.fromDate(this.date.from)
        };
    }


    //converts dates on date to Date from Timestamp date
    fromFirebaseDate = () => {
        this.date = {
            ...this.date,
            to: this.date.to.toDate(),
            from: this.date.from.toDate()
        };
    }

    // create a new date with a set day
    initializeDateTime = (day, hours, minutes) => {
        const now = new Date();
        now.setDate(day);
        now.setHours(hours);
        now.setMinutes(minutes);
        this.date = now;
    }

    // updates time on the date
    updateDateTime = (day, hours, minutes) => {
        this.date.setDate(day);
        this.date.setHours(hours);
        this.date.setMinutes(minutes);
    }
        
}
