import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { logOut } from "../firebase/firebaseAuth";

export default function LogoutDropdown({ user }) {
  const router = useRouter();

  return (
    <Menu>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={
            "absolute xl:bottom-[85px] bottom-16 xl:left-32 left-5 w-56 mt-2 origin-top-right bg-zinc-800 divide-y divide-zinc-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          }
        >
          <div className="">
            <Menu.Item>
              {({ active }) => (
                <button
                  className="flex rounded-md items-center w-full text-white hoverAnimation text-md pl-2 h-fit p-2"
                  onClick={() => {
                    router.replace(`/user/${user.id}`);
                  }}
                >
                  <div className="h-fit w-fit rounded-full mr-2.5 flex items-center justify-center">
                    <img
                      src={user.profilePicture}
                      alt=""
                      className="rounded-full h-14 w-14"
                    />
                  </div>

                  <div className="inline leading-5">
                    <h4 className="font-bold text-lg">{user.username}</h4>
                    <p className="text-[#6e767d]">{user.tag}</p>
                  </div>
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex items-center justify-center w-full text-white p-3 bg-rose-600 hover:bg-rose-700 transition ease-out text-md pl-2`}
                  onClick={() => {
                    logOut();
                  }}
                >
                  <p className="text-lg font-bold ">Logout</p>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
      <Menu.Button
        className={
          "text-[#d9d9d9] flex items-center justify-center hoverAnimation xl:ml-auto mt-auto"
        }
      >
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
      </Menu.Button>
    </Menu>
  );
}
