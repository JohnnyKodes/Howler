import { useRecoilState } from "recoil";
import {
  commentModalState,
  postIdState,
  userState,
} from "../../atoms/modalAtom";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import Moment from "react-moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const Post = ({ id, post, postPage }) => {
  const [isOpen, setIsOpen] = useRecoilState(commentModalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () => setLiked(likes.findIndex((like) => like.id === user.id) !== -1),
    [likes]
  );

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", user.id));
    } else {
      await setDoc(doc(db, "posts", id, "likes", user.id), {
        username: user.username,
      });
    }
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(snapshot.docs);
        }
      ),
    [db, id]
  );

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-zinc-700"
      onClick={() => router.push(`post/${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userProfilePicture}
          alt="profile picture"
          className="h-11 w-11 rounded-full mr-4 cursor-pointer"
        />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              src={post?.userProfilePicture}
              alt="profile picture"
              className="h-11 w-11 rounded-full mr-4 cursor-pointer"
            />
          )}
          <div className="text-[#6e676d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !postPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
              >
                {post?.userTag}
              </span>
            </div>{" "}
            .{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.postText}
              </p>
            )}
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-rose-600" />
          </div>
        </div>
        {postPage && (
          <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.postText}</p>
        )}
        <img
          src={post?.image}
          alt=""
          className="rounded-2xl max-h-[700px] object-cover mr-2"
        />
        <div
          className={`text-[#6e676d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-rose-600 group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-rose-600" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-rose-600 text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {user.id === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-white group-hover:bg-opacity-10">
                <TrashIcon className="h-5 group-hover:text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-rose-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-rose-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-rose-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-rose-600 text-sm ${
                  liked && "text-rose-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-rose-600" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-rose-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
