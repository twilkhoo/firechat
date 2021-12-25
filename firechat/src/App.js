import './App.css';


// Required Firebase/hooks imports vvvvvvvvvvvvv
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { authState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
// Required Firebase/hooks imports ^^^^^^^^^^^

firebase.initializeApp({
    apiKey: "AIzaSyDJ4QF_-erQQt9dTY94U86JSECuZi-OH5I",
    authDomain: "globoo-bookmarks.firebaseapp.com",
    projectId: "globoo-bookmarks",
    storageBucket: "globoo-bookmarks.appspot.com",
    messagingSenderId: "707880529483",
    appId: "1:707880529483:web:dde471df37562504e9a7ce"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
    const [user] = useAuthState();

    return (
        <div className="App">
            <header className="App-header">

            </header>

            <section>
                {user ? <ChatRoom /> : <SignIn />}
            </section>

        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (

        <button onclick={auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'});

    


}


export default App;
