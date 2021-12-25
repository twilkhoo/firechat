import React, { useRef, useState } from 'react';
import './App.css';


// Required Firebase/hooks imports vvvvvvvvvvvvv
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCCvx_FfeAGv3eJsbgXuuo5cUdvqRpGGJE",
    authDomain: "firechat-8758a.firebaseapp.com",
    projectId: "firechat-8758a",
    storageBucket: "firechat-8758a.appspot.com",
    messagingSenderId: "401282479405",
    appId: "1:401282479405:web:57d899dac6add18116cfa4"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// Required Firebase/hooks imports ^^^^^^^^^^^


function App() {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
            <header className="App-header">
                <SignOut />
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
        <>
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )
}

function SignOut() {
    return auth.currentUser && (

        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
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
            <img src={photoURL} alt='user profile pic'/>
            <p>{text}</p>
        </div>
    )
}


export default App;