import React, {useEffect, useState} from 'react';
import {auth, db} from './components/Authentication';
import {useAuthState} from 'react-firebase-hooks/auth';
import { doc, getDoc, collection, setDoc, query, where, getDocs } from '@firebase/firestore';

// import components
import AuthContainer from './components/AuthContainer.js';
import SchedulesContainer from './components/SchedulesContainer.js';

const App = () => {
    const [user] = useAuthState(auth);
    const [uid, setUid] = useState(null);
    const [dbPathExists, setDbPathExists] = useState(false);
    const [data, setData] = useState(undefined);
    const [monthData, setMonthData] = useState(undefined);

    //TODO: make a remove task, and be able to go back on months

    //handle add new date
    const handle_add_date = (newDate) => {
        //TODO: bug: data doesnt update correctly
        //TODO: check if the new data doesnt overlap with some other

        let newMonthData = monthData;

        //TODO: handle this case
        //when the user has no appointments this month 
        if (!newMonthData || newMonthData.days.length === 0) return;

        let foundFlag = false;
        newMonthData.days.forEach( (day) => {
            const monthDayNumber = day.date.toDate().getDate();
            const newDayNumber = newDate.to.toDate().getDate();
            if (monthDayNumber === newDayNumber) {
                //case when they date is beeing added to a day that already has dates
                day.dates = [...day.dates, newDate];
                foundFlag = true;
            } 
        });

        //if the day that will have this new date doesnt already have any other dates
        if (!foundFlag) {
            // should make brand new date
            newMonthData.days.push({
                date: newDate.to,
                dates: [newDate]
            });
        }

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

        const docRef = db.collection('data').doc(userId);

        //retrieves data from db
        getDoc(docRef).then( (docSnap) => {
            const data = docSnap.data();

            //the user has data
            if (data) {
                console.log('data: ', data);
                setData(data);
            }

        } ).catch( (err) => {console.log(err)} );


    }, [user]);

    // store user's data in the data base
    useEffect( () => {

        //console.log('updating data');

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
