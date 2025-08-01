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

// Debug: Log configuration (without sensitive data)
console.log("Firebase Config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google popup (better for development)
export const signInWithGoogle = () => {
  console.log("Initiating Google sign-in popup...");
  try {
    return signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

// Alternative redirect method
export const signInWithGoogleRedirect = () => {
  console.log("Initiating Google sign-in redirect...");
  try {
    return signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error during Google sign-in redirect:", error);
    throw error;
  }
};

// Handle redirect result
export const handleGoogleRedirect = () => {
  console.log("Checking for Google redirect result...");
  return getRedirectResult(auth)
    .then((result: any) => {
      if (result) {
        console.log("Google sign-in successful:", result.user.email);
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        return { user, token };
      }
      console.log("No redirect result found");
      return null;
    })
    .catch((error: any) => {
      console.error("Google redirect error:", error);
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