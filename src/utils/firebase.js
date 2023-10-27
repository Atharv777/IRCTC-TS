import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getDoc, setDoc, addDoc, collection, doc, getFirestore, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "irctc-ts.firebaseapp.com",
    projectId: "irctc-ts",
    storageBucket: "irctc-ts.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


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
            const dataToStore = { ...user, address, role, pastOrders: [] }
            await setDoc(doc(db, "users", user.verifierId), dataToStore)
        }
    }
    catch (e) {
        console.log(e)
    }
}

export const getUserDetails = async (verifierId) => {
    try {
        const docRef = doc(db, "users", verifierId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data()
        }
        else {
            return null
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


export const uploadImage = async (file, fileName) => {
    try {
        const storageRef = ref(storage, `/${fileName}`);
        const snapshot = await uploadBytes(storageRef, file)
        const downURL = await getDownloadURL(snapshot.ref)
        return downURL
    }
    catch (e) {
        console.log(e)
    }
};

export const storeMessage = async (message, imgUrl, user, seat, colName) => {
    const { verifierId, name, profileImage } = user;
    await addDoc(collection(db, colName), {
        text: message,
        name: name,
        avatar: profileImage,
        timestamp: serverTimestamp(),
        seat: seat,
        imgUrl,
        uid: verifierId,
    });
};