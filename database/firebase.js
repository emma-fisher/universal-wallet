// database/firebaseDb.js

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBZ_cXg4cEzBlzEtu1TKSsPHYxxoXZT7U4",
    authDomain: "universal-wallet-73b42.firebaseapp.com",
    databaseURL: "https://universal-wallet-73b42.firebaseio.com",
    projectId: "universal-wallet-73b42",
    storageBucket: "universal-wallet-73b42.appspot.com",
    messagingSenderId: "479443661280",
    appId: "1:479443661280:ios:5806031db0084e650a3b85"
};

firebase.initializeApp(firebaseConfig);

export default firebase;