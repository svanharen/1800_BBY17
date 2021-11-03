const firebaseConfig = {
  apiKey: "AIzaSyBLYvL8ai6JyuzKldHLjRdZ0A_ahcYpaBM",
  authDomain: "webapp-9f187.firebaseapp.com",
  projectId: "webapp-9f187",
  storageBucket: "webapp-9f187.appspot.com",
  messagingSenderId: "271835665384",
  appId: "1:271835665384:web:427ffcca0a4e89528aca5d"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();