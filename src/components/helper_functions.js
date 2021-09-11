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

const helper_get_total_quarters = (date) => {
    //returns the total sum of quarters of hours has this date
    const hours = (4*date.getHours());
    const minutes = Math.round(date.getMinutes() / 15);
    return hours + minutes + 1;
}

export {
    get_random_id,
    get_days_of_month,
    get_random_hsl,
    helper_get_total_quarters
}
