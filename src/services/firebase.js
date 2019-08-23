import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC3dVlMXmJAE0xmBvtwLhZRiBAD6we2K6E",
    authDomain: "upperline2019.firebaseapp.com",
    databaseURL: "https://upperline2019.firebaseio.com",
    projectId: "upperline2019",
    storageBucket: "",
    messagingSenderId: "647297537596",
    appId: "1:647297537596:web:b6bbb4cc656a8fbb"
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  
  export const auth = firebase.auth()
  export const db = firebase.firestore()
  
  export default firebase