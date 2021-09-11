import React, {useEffect, useState} from 'react';
import {auth, db} from './components/Authentication';
import {useAuthState} from 'react-firebase-hooks/auth';

// import components
import AuthContainer from './components/AuthContainer.js'
import SchedulesContainer from './components/SchedulesContainer.js'

//create addHours method for Date prototype
Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}
Date.prototype.addDays = function(d){
    this.setDate(this.getDate()+d);
    return this;
}
Date.prototype.addMonth = function(m){
    this.setMonth(this.getMonth()+m);
    return this;
}

//date structure
//const DATA = [
    //{
        //date: new Date(),
        //days: [
            //{
                //date: new Date(),
                //dates: [
                    //{
                        //title: 'dentist',
                        //content: 'alsjkdaslkjñdha',
                        //from: new Date(),
                        //to: new Date().addHours(3),
                    //}
                //]
            //}
        //]
    //},
    //{
        //date: new Date().addMonth(1),
        //days: [
            //{
                //date: new Date().addDays(8),
                //dates: [
                    //{
                        //title: 'dentist',
                        //content: 'alsjkdaslkjñdha',
                        //from: new Date().addHours(10),
                        //to: new Date().addHours(13),
                    //}
                //]
            //}
        //]
    //}
//]

const App = () => {
    const [user] = useAuthState(auth);
    const [uid, setUid] = useState(null);
    const [dbPathExists, setDbPathExists] = useState(false);
    const [data, setData] = useState(null);
    const [monthData, setMonthData] = useState(null);

    //handle add new date
    const handle_add_date = (newDate) => {
        console.log('new date!')
        console.log(newDate);
        console.log(monthData.days);
        let newMonthData = monthData;
        newMonthData.days.forEach( (day) => {
            if (day.date.toDate().getDate() === newDate.to.toDate().getDate()) {
                //gets the day that will have this new date
                day.dates = [...day.dates, newDate];
            }
        });
        setMonthData(newMonthData);
    }

    //set the data for the current month once the total data has been retrieved
    useEffect( () => {
        // if the data is not set yet
        if (!data || data.length === 0) return;

        //loop over all the data and if there is data for the current year and month, update the month data
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        //console.log('data: ', data);

        data.forEach( (dataPerMonth) => {
            //console.log('dataPerMonth: ', dataPerMonth);
            const storedDate = dataPerMonth.date.toDate();
            const storedYear = storedDate.getFullYear();
            const storedMonth = storedDate.getMonth();
            //console.log('Store date: %d/%d', storedMonth, storedYear);
            if (storedYear === currentYear && storedMonth === currentMonth) {
                //if theres stored date for the current month set it
                setMonthData(dataPerMonth);
            }
        });
    }, [data]);

    //retrieve data every time the user logs on
    useEffect(() => {

        //case when logout
        if (!user) return;

        // set user id
        const userId = user.multiFactor.user.uid;
        setUid(userId);

        db.collection('data').get()
            .then( (querySnapshot) => {
                const data = querySnapshot.docs.map( doc => doc.data());
                if (data[0]) {
                    //if the data exists retrieve it
                    //console.log(data[0])
                    setData(data[0].data);
                    setDbPathExists(true);
                }
            })
            .catch( (error) => {
                console.error("Error reading document: ", error);
            });

        //db.collection('data').doc(userId).set({ DATA }, { merge: true });

    }, [user]);

    // store user's data in the data base
    useEffect( () => {

        if (!user || monthData.length === 0 || !uid) return;

        //if the data base path exists update data, else create the new path
        if (dbPathExists){
            // exists
            db.collection('data').doc(uid).update({ data })
                .then( () => {
                    //console.log("Document successfully written!");
                })
                .catch( (error) => {
                    console.error("Error writing document: ", error);
                });
        } else {
            // create the path
            db.collection('data').doc(uid).set({ data }, { merge: true });
            setDbPathExists(true);
        }

    }, [monthData])

    return(
        <main className="main">
            <AuthContainer user={user} />
            <SchedulesContainer monthData={monthData} updateMonthData={(newDate) => handle_add_date(newDate)} />
        </main>
    )
}

export default App;
