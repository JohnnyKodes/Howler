import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/modalAtom";

const Sidebar = () => {
  const [user, setUser] = useRecoilState(userState);

  console.log(user);

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image
          src={"/HowlerLogo.png"}
          width={30}
          height={30}
          alt="bulletin logo"
          className=""
        />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} active />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-rose-600 text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-rose-700 transition duration-200 ease-in-out">
        Howl
      </button>
      <div className="text-[#d9d9d9] flex items-center justify-center hoverAnimation xl:ml-auto mt-auto">
        <div className="h-fit w-fit rounded-full xl:mr-2.5 flex items-center justify-center">
          <img
            src={user.profilePicture}
            alt=""
            className="rounded-full xl:mr-2.5 h-11 w-11"
          />
        </div>

        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{user.username}</h4>
          <p className="text-[#6e767d]">{user.tag}</p>
        </div>
        <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
};

export default Sidebar;
