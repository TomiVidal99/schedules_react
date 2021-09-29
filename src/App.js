import React, {useEffect, useState} from 'react';
import {auth, db} from './components/Authentication';
import {useAuthState} from 'react-firebase-hooks/auth';
import { getDoc } from '@firebase/firestore';
import {Timestamp} from 'firebase/firestore';

// import components
import AuthContainer from './components/AuthContainer.js';
import SchedulesContainer from './components/SchedulesContainer.js';

const App = () => {
    const [user] = useAuthState(auth);
    const [uid, setUid] = useState(null);
    const [dbPathExists, setDbPathExists] = useState(false);
    const [data, setData] = useState(undefined);
    const [monthData, setMonthData] = useState(undefined);
    const [isChangingMonth, setIsChangingMonth] = useState(false);

    //handle add new date
    const handle_add_date = (newDate) => {
        //console.log({newDate});

        //TODO: check if the new data doesnt overlap with some other

        // if the user doesnt have any data create it
        if (monthData === undefined || Object.entries(monthData).length === 0) {
            const today = new Date();
            const newMonthData = {
                date: Timestamp.fromDate(today),
                days: [{
                    date: newDate.to,
                    dates: [newDate]
                }]
            };

            setMonthData(newMonthData);

        } else {
            // if the user already has data add the new date where it corresponds
            let newMonthData = monthData;

            let foundFlag = false;

            newMonthData.days.forEach( (day) => {
                const monthDayNumber = day.date.toDate().getDate();
                const newDayNumber = newDate.to.toDate().getDate();
                if (monthDayNumber === newDayNumber) {
                    //case when they date is beeing added to a day that already has dates
                    day.dates = [...day.dates, newDate];
                    //console.log('date updated: ', day.dates);
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
                //console.log('date updated: ', newMonthData.days);
            }

            //console.log('newMonthData: ', newMonthData);
            setMonthData({
                date: newMonthData.date,
                days: newMonthData.days,
            });
        }
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
        if (!user) {
            setData([]);
            setMonthData({})
            return;
        }

        // set user id
        const userId = user.multiFactor.user.uid;
        setUid(userId);

        const docRef = db.collection('data').doc(userId);

        //retrieves data from db and store it in components state
        getDoc(docRef)
            .then( (docSnap) => {
                const data = docSnap.data();
                //the user has data
                if (data) {
                    //console.log('data: ', data);
                    setData(data.data);
                }
            })
            .catch( (err) => {
                console.log(err)} 
            );

    }, [user]);

    // store user's data in the data base
    useEffect(() => {

        if (isChangingMonth) setIsChangingMonth(false);

        if (isChangingMonth || !user || monthData.length === 0 || !uid) return;

        //updates data
        let Data;
        if (data === undefined) {
            Data = monthData;
        } else {
            Data = [...data.filter( (monthD) => monthD.date !== monthData.date), monthData];
        }
        setData(Data);

        //if the data base path exists update data, else create the new path
        if (dbPathExists){
            // exists
            db.collection('data').doc(uid).update({ data: [...Data] })
                .then( () => {
                    //console.log("Document successfully written!");
                })
                .catch( (error) => {
                    console.error("Error writing document: ", error);
                });
        } else {
            // create the path
            db.collection('data').doc(uid).set({ data: [...Data] }, { merge: true });
            setDbPathExists(true);
        }

    }, [monthData])

    // set prev/next month
    const gotoMonth = ({month, year}) => {
        //console.log(`Changing month: ${month}/${year}`);
        //console.log(month, year);

        if (!data) return;
        setIsChangingMonth(true);

        let foundDataFlag = false;
        data.forEach( (dMonth) => {
            //console.log(dMonth);
            const formattedDate = dMonth.date.toDate();
            const y = formattedDate.getFullYear();
            const m = formattedDate.getMonth();

            if (m === month && y === year) {
                console.log('got matched data: ', dMonth);
                foundDataFlag = true;
                setMonthData(dMonth);
            }

        });

        if (!foundDataFlag) {
            const newDate = new Date();
            newDate.setMonth(month);
            newDate.setFullYear(year);
            //console.log(monthData);
            setMonthData({date: Timestamp.fromDate(newDate), days: []});
        }

    }

    return(
        <main className="main">
            <AuthContainer user={user} />
            <SchedulesContainer 
                isAuthenticated={user ? true : false}
                monthData={monthData}
                updateMonthData={(newDate) => handle_add_date(newDate)}
                setMonthData={(newData) => {setMonthData(newData)}}
                gotoMonth={ (payload) => {gotoMonth(payload)}}
            />
        </main>
    )
}

export default App;
