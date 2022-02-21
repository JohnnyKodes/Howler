import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect, useRef } from "react";
import { XIcon, CameraIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";
import { emailSignUp, emailSignIn } from "../../firebase/firebaseAuth";
import { useRecoilState } from "recoil";
import { editModalState } from "../../atoms/modalAtom";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const EditProfileModal = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const profilePickerRef = useRef(null);
  const bannerRef = useRef(null);
  const [bio, setBio] = useState(user.description);
  const [isOpen, setIsOpen] = useRecoilState(editModalState);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(user.username);
  const [profilePicture, setProfilePicture] = useState(null);
  const [banner, setBanner] = useState(null);

  const closeModal = () => {
    setProfilePicture(null);
    setBanner(null);
    setUsername("");
    setBio("");
    setIsOpen(!isOpen);
  };

  const addUserPictureToDisplay = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setProfilePicture(readerEvent.target.result);
    };
  };

  const addBannerToDisplay = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setBanner(readerEvent.target.result);
    };
  };

  const updateProfilePicture = async () => {
    const imageRef = ref(storage, `users/${user.id}/profilePicture`);

    if (profilePicture) {
      await uploadString(imageRef, profilePicture, "data_url").then(
        async () => {
          const downloadUrl = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "users", user.id), {
            profilePicture: downloadUrl,
          });
        }
      );
    }
  };

  const updateBanner = async () => {
    const imageRef = ref(storage, `users/${user.id}/banner`);

    if (banner) {
      await uploadString(imageRef, banner, "data_url").then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", user.id), {
          banner: downloadUrl,
        });
      });
    }
  };

  const updateUsername = async () => {
    if (username.toLowerCase() !== user.username.toLowerCase()) {
      await updateDoc(doc(db, "users", user.id), {
        username,
        tag: "@".concat(username.split(" ").join("").toLowerCase()),
      });
    }
  };

  const updateBio = async () => {
    if (bio.toLowerCase() !== user.description.toLowerCase()) {
      await updateDoc(doc(db, "users", user.id), {
        description: bio,
      });
    }
  };

  const updateUser = () => {
    updateProfilePicture();
    updateBanner();
    updateUsername();
    updateBio();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 pt-8"
        onClose={() => closeModal()}
      >
        <div className="flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 mt-10">
          <Transition.Child
            as={"div"}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
          </Transition.Child>
          <Transition.Child
            as={"div"}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-zinc-900 rounded-2xl text-left overflow-visible overflow-x-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full w-[95vw]">
              <div className="flex items-center px-2 py-2">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => closeModal()}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
                <div className="w-full h-full flex items-center justify-between px-5">
                  <h1 className="text-white font-bold text-xl">Edit Profile</h1>
                  <button
                    className="h-[32px] w-[65px] bg-black text-white rounded-full hover:bg-white hover:bg-opacity-5 transition ease-out "
                    onClick={updateUser}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="h-[500px] bg-zinc-900 w-full text-white">
                <div className="flex flex-col mb-16">
                  <div className="w-full h-[200px] bg-rose-600">
                    <div className="absolute z-0 w-full h-[200px]">
                      {banner ? (
                        <img
                          src={banner}
                          alt="user banner"
                          className="h-full w-full"
                        />
                      ) : user.banner ? (
                        <img
                          src={user.banner}
                          alt="user banner"
                          className="h-full w-full"
                        />
                      ) : null}
                    </div>

                    <div className="w-full h-[200px] bg-black bg-opacity-40 flex items-center justify-center gap-8 text-[#d9d9d9] z-30 absolute">
                      <button className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                        <div
                          onClick={() => bannerRef.current.click()}
                          className="flex items-center justify-center"
                        >
                          <CameraIcon className="p-2" />
                          <input
                            type="file"
                            hidden
                            onChange={addBannerToDisplay}
                            ref={bannerRef}
                          />
                        </div>
                      </button>
                      <button className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                        <XIcon className="p-2" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full px-4 z-40 ">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="profile picture"
                        className="h-36 w-36 rounded-full absolute top-[180px]"
                      />
                    ) : (
                      <img
                        src={user.profilePicture}
                        alt="profile picture"
                        className="h-36 w-36 rounded-full absolute top-[180px]"
                      />
                    )}
                    <div className="h-36 w-36 rounded-full absolute top-[180px] bg-black bg-opacity-50 border-white border-4 flex justify-center items-center">
                      <div
                        className="w-1/3 h-1/3 flex items-center justify-center bg-black bg-opacity-60 rounded-full cursor-pointer"
                        onClick={() => profilePickerRef.current.click()}
                      >
                        <CameraIcon className="p-2 text-[#d9d9d9]" />
                        <input
                          type="file"
                          hidden
                          onChange={addUserPictureToDisplay}
                          ref={profilePickerRef}
                        />
                      </div>
                    </div>
                    <div className="text-transparent">filler</div>
                  </div>
                </div>
                <div className="flex flex-col mt-5 gap-5 px-10">
                  <div className="flex flex-col">
                    <label htmlFor="" className="text-lg mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border border-zinc-700 border-1 p-4 rounded outline-none focus:border-rose-600 transition ease-out"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="text-lg mb-1">
                      Bio
                    </label>
                    <textarea
                      className="bg-transparent border border-zinc-700 border-1 p-4 rounded outline-none mb-10 focus:border-rose-600 transition ease-out "
                      value={bio}
                      rows={2}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={200}
                      minLength={10}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditProfileModal;
