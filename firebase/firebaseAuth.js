import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
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
          description: "Set a description so that people can know you better!",
          followers: [],
          following: [],
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
    signInWithPopup(auth, googleProvider).then((result) => {
      const user = result?.user;
      const username = user.email.toString().split("@").shift();

      console.log(user);

      (async () => {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          username,
          email: user.email,
          tag: "@".concat(username.split(" ").join("").toLowerCase()),
          profilePicture: defaultProfilePicture,
          banner: "",
          description: "Set a description so that people can know you better!",
          followers: [],
          following: [],
        });
      })();
    });
  }
};

export const logOut = () => {
  signOut(auth).catch((error) => {
    alert(error.message);
  });
};
