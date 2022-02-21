import { ArrowLeftIcon } from "@heroicons/react/solid";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import millify from "millify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editModalState } from "../../atoms/modalAtom";
import { db } from "../../firebase/firebase";

const ProfileHeader = ({ user, postsLength, loggedUser }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useRecoilState(editModalState);
  const [isFollowing, setIsFollowing] = useState(false);
  const test = [];

  useEffect(() => {
    if (user.followers) {
      setIsFollowing(
        user.followers.findIndex((follower) => follower === loggedUser.id) !==
          -1
      );
    }
  }, [user]);

  const followUser = async () => {
    if (isFollowing) {
      await updateDoc(doc(db, "users", user.id), {
        followers: user.followers.filter((id) => id !== loggedUser.id),
      });
      await updateDoc(doc(db, "users", loggedUser.id), {
        following: loggedUser.following.filter((id) => id !== user.id),
      });
    } else {
      await updateDoc(doc(db, "users", user.id), {
        followers: [...user.followers, loggedUser.id],
      });
      await updateDoc(doc(db, "users", loggedUser.id), {
        following: [...loggedUser.following, user.id],
      });
    }
  };

  return (
    <>
      <div className="flex items-center px-1.5 py-2 border-b border-zinc-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-zinc-900">
        <div
          className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
          onClick={() => router.push("/")}
        >
          <ArrowLeftIcon className="h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm text-[#d9d9d9]">{`${postsLength} ${
            postsLength > 1 ? "Howls" : "Howl"
          }`}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="w-full h-[200px] bg-rose-600">
          {user.banner && (
            <img
              src={user.banner}
              alt="user banner"
              className="h-full w-full"
            />
          )}
        </div>
        <div className="flex justify-between items-center w-full px-4 z-40  pb-4">
          <img
            src={user.profilePicture}
            alt="profile picture"
            className="h-36 w-36 rounded-full cursor-pointer absolute top-[190px]"
          />
          <div className="text-transparent">filler</div>
          {user.id === loggedUser.id ? (
            <button
              className="h-[36px] w-[112px] rounded-full border-zinc-700 border bg-transparent text-white font-bold mt-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              Edit Profile
            </button>
          ) : isFollowing ? (
            <button
              className="h-[36px] w-[112px] rounded-full bg-rose-600 text-white font-bold mt-4"
              onClick={() => followUser()}
            >
              Following
            </button>
          ) : (
            <button
              className="h-[36px] w-[112px] rounded-full bg-black bg-opacity-60 text-white font-bold mt-4"
              onClick={() => followUser()}
            >
              Follow
            </button>
          )}
        </div>
        <div className="px-4 mt-4">
          <div className="text-white">
            <p className="text-xl font-bold ">{user.username}</p>
            <p className="text-md text-[#d9d9d9]">{user.tag}</p>
          </div>

          <div className="mt-4">
            <p className="text-white">{user.description}</p>
            <div className="flex justify-between mt-2 w-fit text-[#d9d9d9]">
              <p className="mr-5">
                <strong className="text-white">
                  {user.followers
                    ? millify(user?.followers.length, { precision: 2 })
                    : ""}
                </strong>{" "}
                followers
              </p>
              <p>
                <strong className="text-white">
                  {user.following
                    ? millify(user?.following.length, { precision: 2 })
                    : ""}
                </strong>{" "}
                following
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
