import Head from "next/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "../components/Login";
import AuthModal from "../components/Login/AuthModal";
import { useRecoilState } from "recoil";
import {
  authModalState,
  authModalType,
  commentModalState,
  userState,
} from "../atoms/modalAtom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import Sidebar from "../components/Sidebar";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import Feed from "../components/Feed";
import CommentModal from "../components/Post/CommentModal";
import Widgets from "../components/Widgets";

export default function Home({ trendingResults, followResults }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useRecoilState(authModalState);
  const [isCommentModalOpen, setIsCommentModalOpen] =
    useRecoilState(commentModalState);
  const [authType, setAuthType] = useRecoilState(authModalType);
  const [userData, setUserData] = useRecoilState(userState);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setLoggedUser(currentUser);
      }),
    [auth]
  );

  useEffect(() => {
    if (auth.currentUser) {
      onSnapshot(
        query(collection(db, "users"), where("id", "==", auth.currentUser.uid)),
        (snapshot) => {
          setUserData(snapshot.docs[0].data());
        }
      );
    }
  }, [db, loggedUser]);

  if (!loggedUser)
    return (
      <>
        <Login />
        {isAuthModalOpen && <AuthModal modalType={authType} />}
      </>
    );

  return (
    <div>
      <Head>
        <title>Howler</title>
        <meta name="description" content="Howler" />
        <link rel="icon" href="/HowlerLogoColored.png" />
      </Head>
      <main className="bg-zinc-900 min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isCommentModalOpen && <CommentModal />}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );

  const auth = getAuth();

  return {
    props: {
      trendingResults,
      followResults,
    },
  };
}
