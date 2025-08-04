import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, getRedirectResult, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "791289037177",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-8H76MCENZT"
};

// Firebase configuration is loaded from environment variables

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup (better for development)
export const signInWithGoogle = () => {
  try {
    return signInWithPopup(auth, googleProvider);
  } catch (error) {
    // Error during Google sign-in
    throw error;
  }
};

// Alternative redirect method
export const signInWithGoogleRedirect = () => {
  try {
    return signInWithRedirect(auth, googleProvider);
  } catch (error) {
    // Error during Google sign-in redirect
    throw error;
  }
};

// Handle redirect result
export const handleGoogleRedirect = () => {
  return getRedirectResult(auth)
    .then((result: any) => {
      if (result) {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        return { user, token };
      }
      return null;
    })
    .catch((error: any) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      throw { errorCode, errorMessage, email, credential };
    });
};

export { auth };