import {get_random_id} from './../components/helper_functions';
import {Timestamp} from 'firebase/firestore/';

export default class DateClass {
    constructor() {
        this.date = {
            id: get_random_id(),
            title: '',
            content: '',
            to: null,
            from: null,
        }
    }

    setTitle = (title) => {
        this.date.title = title;
    }

    setContent = (content) => {
        this.date.content = content;
    }

    setId = (id) => {
        this.date.id = id;
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
    initializeTo = (day, hours, minutes) => {
        const now = new Date();
        now.setDate(day);
        now.setHours(hours);
        now.setMinutes(minutes);
        this.date.to = now;
    }
    initializeFrom = (day, hours, minutes) => {
        const now = new Date();
        now.setDate(day);
        now.setHours(hours);
        now.setMinutes(minutes);
        this.date.from = now;
    }

    // updates time on the date
    updateTo = (day, hours, minutes) => {
        console.log({day: day, hours: hours, minutes: minutes, to: this.date.to});
        this.date.to.setDate(day);
        this.date.to.setHours(hours);
        this.date.to.setMinutes(minutes);
        this.date.toFirebaseDate();
    }
    updateFrom = (day, hours, minutes) => {
        this.date.from.setDate(day);
        this.date.from.setHours(hours);
        this.date.from.setMinutes(minutes);
        this.date.toFirebaseDate();
    }
        
}
