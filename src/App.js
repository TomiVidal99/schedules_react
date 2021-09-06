import React, {useEffect, useState} from 'react';
import {auth, db} from './components/Authentication';
import {useAuthState} from 'react-firebase-hooks/auth';

// import components
import AuthContainer from './components/AuthContainer.js'
import SchedulesContainer from './components/SchedulesContainer.js'

//const MONTH = [
    //{
        //number: 1,
        //dates: [ {
                //title: 'doctor',
                //content: 'do something',
                //from: 123213123123,
                //to: 12312312312312312312312,
                //alarm: false
            //}
        //],
    //},
    //{
        //number: 2,
        //dates: [
            //{
                //title: 'dentist',
                //content: 'do something',
                //from: 123213123123,
                //to: 12312312312312312312312,
                //alarm: false
            //}
        //],
    //}
//]

const App = () => {
    const [user] = useAuthState(auth);
    const [uid, setUid] = useState(null);
    const [dbPathExists, setDbPathExists] = useState(false);
    const [month, setMonth] = useState(null);

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
                    setMonth(data[0].data);
                    setDbPathExists(true);
                }
            })
            .catch( (error) => {
                console.error("Error reading document: ", error);
            });

        //db.collection('data').doc(userId).set({ data: MONTH }, { merge: true });

    }, [user]);

    // store user's data in the data base
    useEffect( () => {

        if (!user || month.length === 0 || !uid) return;

        //if the data base path exists update data, else create the new path
        if (dbPathExists){
            // exists
            db.collection('data').doc(uid).update({ data: month })
                .then( () => {
                    //console.log("Document successfully written!");
                })
                .catch( (error) => {
                    console.error("Error writing document: ", error);
                });
        } else {
            // create the path
            db.collection('data').doc(uid).set({ data: month }, { merge: true });
            setDbPathExists(true);
        }

    }, [month])

    return(
        <main className="main">
            <AuthContainer user={user} />
            <SchedulesContainer month={month} />
        </main>
    )
}

export default App;
