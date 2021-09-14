//some helper functions

const get_random_id = () => {
    return(Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1));
}

const get_days_of_month = (month, year) => {
    return new Date(year, month, 0).getDate();
}

const get_random_hsl = (saturation, light) => {
    const random_hue = Math.random() * 100;
    return `hsl(${random_hue}, ${saturation}%, ${light}%)`;
}

const get_total_quarters_of_hours = (date) => {
    //console.log(date);
    //returns the total sum of quarters of hours has this date
    const hours = (4*date.getHours());
    const minutes = Math.round(date.getMinutes() / 15);
    return hours + minutes + 1;
}

//return the numerical in decimal value of an input.value date
const get_time_from_inputs = (inputValue) => {
    const [hours, minutes] = inputValue.split(':');
    return([
        parseInt(hours, 10),
        parseInt(minutes, 10),
    ]);
}

//updates time on a date object
const helper_update_dateTime_on_date = (dateTime, hours, minutes) => {
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);
}


export {
    get_random_id,
    get_days_of_month,
    get_random_hsl,
    get_total_quarters_of_hours,
    get_time_from_inputs,
    helper_update_dateTime_on_date
}
