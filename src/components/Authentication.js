import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcEiUK9h2nJonbGCultBQzyadTTobT9bs",
  authDomain: "schedules-d136c.firebaseapp.com",
  projectId: "schedules-d136c",
  storageBucket: "schedules-d136c.appspot.com",
  messagingSenderId: "626359380756",
  appId: "1:626359380756:web:6f6589cb17e115aafe7001"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const handle_signin_google = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const handle_logout = () => {
  auth.signOut();
};

export {
    auth,
    db,
    handle_signin_google,
    handle_logout,
};

