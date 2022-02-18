import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

const defaultProfilePicture =
  "https://firebasestorage.googleapis.com/v0/b/howler-58fee.appspot.com/o/Howler_DefaultProfilePicture.png?alt=media&token=739bc569-8de2-4766-8995-bc447965ea58";

const googleProvider = new GoogleAuthProvider();

export const emailSignUp = async (email, password, username) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      (async () => {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          username,
          email,
          tag: "@".concat(username.split(" ").join("").toLowerCase()),
          profilePicture: defaultProfilePicture,
          banner: "",
        });
      })();
    })
    .catch((error) => alert(error.message));
};

export const emailSignIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    alert(error.message);
  });
};

export const signInWithProvider = (provider) => {
  if (provider === "GOOGLE") {
    signInWithRedirect(auth, googleProvider);

    getRedirectResult(auth).then((result) => {});
  }
};
