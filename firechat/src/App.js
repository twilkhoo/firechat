import React, { useRef, useState } from 'react';
import './App.css';


// Required Firebase/hooks imports vvvvvvvvvvvvv
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
const analytics = firebase.analytics();
// Required Firebase/hooks imports ^^^^^^^^^^^


function App() {
    const [user] = useAuthState(auth);

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

    const dummy=useRef();

    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');

        dummy.current.scrollIntoView({ behavior: 'smooth' })
    }


    return (
        <>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
            
                <div ref={dummy}></div>
            </main>

            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <button type='submit'>Send</button>
            </form>
        </>
    )
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';    

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL} />
            <p>{text}</p>
        </div>
    )
}


export default App;