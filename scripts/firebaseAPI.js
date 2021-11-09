const firebaseConfig = {
  // apiKey: "AIzaSyBLYvL8ai6JyuzKldHLjRdZ0A_ahcYpaBM",
  // authDomain: "webapp-9f187.firebaseapp.com",
  // projectId: "webapp-9f187",
  // storageBucket: "webapp-9f187.appspot.com",
  // messagingSenderId: "271835665384",
  // appId: "1:271835665384:web:427ffcca0a4e89528aca5d"

  apiKey: "AIzaSyC7nuhfSNakCZbjgmrvvNiSCLajfzNOV6w",
  authDomain: "game-test-71f93.firebaseapp.com",
  projectId: "game-test-71f93",
  storageBucket: "game-test-71f93.appspot.com",
  messagingSenderId: "947990707814",
  appId: "1:947990707814:web:e26a68374c9e3b840877a7",
  measurementId: "G-FDFN38B02P"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();