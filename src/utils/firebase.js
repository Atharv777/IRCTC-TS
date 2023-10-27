import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getDoc, setDoc, doc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "irctc-ts.firebaseapp.com",
    projectId: "irctc-ts",
    storageBucket: "irctc-ts.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export const signInWithGoogle = async () => {
    try {
        const googleProvider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, googleProvider);
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const storeUserDetails = async (user, address, role) => {
    try {
        const userExists = await checkIfUserExists(user.verifierId)
        if (!userExists) {
            const dataToStore = { ...user, address, role }
            await setDoc(doc(db, "users", user.verifierId), dataToStore)
        }
    }
    catch (e) {
        console.log(e)
    }
}

const checkIfUserExists = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return (docSnap.exists())
}

