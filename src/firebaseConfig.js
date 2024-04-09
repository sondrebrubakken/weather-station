// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAC314pCfq3q5irPaBjHmfaZ2XY87GGfLU",
    authDomain: "weather-station-75efa.firebaseapp.com",
    databaseURL: "https://weather-station-75efa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "weather-station-75efa",
    storageBucket: "weather-station-75efa.appspot.com",
    messagingSenderId: "414713128547",
    appId: "1:414713128547:web:ab49e10527a7123b21fa56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export default database;
