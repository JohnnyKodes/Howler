import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { commentModalState } from "../../atoms/modalAtom";
import CommentModal from "../../components/Post/CommentModal";
import Sidebar from "../../components/Sidebar";
import Post from "../../components/Post";
import { auth, db } from "../../firebase/firebase";
import Head from "next/head";
import Login from "../../components/Login";
import Comment from "../../components/Post/Comment";
import Widgets from "../../components/Widgets";

const PostPage = ({ trendingResults, followResults }) => {
  const [isOpen, setIsOpen] = useRecoilState(commentModalState);
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  if (!auth.currentUser) return <Login />;

  return (
    <>
      <Head>
        <title>
          {post?.username} on Howler: &quot;{post?.postText}&quot;
        </title>
        <link rel="icon" href="/HowlerLogoColored.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <main className="bg-zinc-900 min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-zinc-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-zinc-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-zinc-900">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Bullet
          </div>

          <Post id={id} post={post} postPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isOpen && <CommentModal />}
      </main>
    </>
  );
};
export default PostPage;

export async function getServerSideProps(context) {
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
