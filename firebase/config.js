// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyBILcP4dxL3iCRK1ypGqBuhBtH9GlZeQ7s",
  authDomain: "clustered-d0c43.firebaseapp.com",
  projectId: "clustered-d0c43",
  storageBucket: "clustered-d0c43.appspot.com",
  messagingSenderId: "1005896740955",
  appId: "1:1005896740955:web:4d759bdf18bebb9411cf7e",
  measurementId: "G-QC9ZMHKP5D",
  databaseURL: "https://clustered-d0c43-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { app, db };
