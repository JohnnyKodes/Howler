import { ArrowLeftIcon } from "@heroicons/react/solid";
import {
  collection,
  collectionGroup,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editModalState, userState } from "../../atoms/modalAtom";
import Login from "../../components/Login";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import UserFeed from "../../components/Profile/UserFeed";
import Sidebar from "../../components/Sidebar";
import Widgets from "../../components/Widgets";
import { auth, db } from "../../firebase/firebase";

const UserPage = ({ trendingResults, followResults }) => {
  const [isOpen, setIsOpen] = useRecoilState(editModalState);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loggedUser, setLoggedUser] = useRecoilState(userState);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "users", id), (snapshot) => {
        setUser(snapshot.data());
      }),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), where("id", "==", id.toString())),
        (snapshot) => setPosts(snapshot.docs.map((doc) => doc.data()))
      ),
    [db, id]
  );

  useEffect(() => {
    if (auth.currentUser) {
      onSnapshot(
        query(collection(db, "users"), where("id", "==", auth.currentUser.uid)),
        (snapshot) => {
          setLoggedUser(snapshot.docs[0].data());
        }
      );
    }
  }, [db, auth.currentUser]);

  if (!auth.currentUser) return <Login />;

  return (
    <>
      <Head>
        <title>{user?.username} on Howler</title>
        <link rel="icon" href="/HowlerLogoColored.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <main className="bg-zinc-900 min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-zinc-700 max-w-2xl sm:ml-[73px] xl:ml-[370px] overflow-x-visible">
          <ProfileHeader
            user={user}
            postsLength={posts.length}
            loggedUser={loggedUser}
          />
          <UserFeed posts={posts} />
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isOpen && user.id === loggedUser.id && (
          <EditProfileModal user={user} />
        )}
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );

  return {
    props: {
      trendingResults,
      followResults,
    },
  };
}

export default UserPage;
