import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import { XIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";
import {
  emailSignUp,
  emailSignIn,
  signInWithProvider,
} from "../../firebase/firebaseAuth";
import { useRecoilState } from "recoil";
import { authModalState } from "../../atoms/modalAtom";

const usernameRegex = /^[a-zA-z][a-zA-z0-9_]{3,15}$/;
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

const AuthModal = ({ modalType }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showUsernameDisclaimer, setShowUsernameDisclaimer] = useState(false);
  const [showEmailDisclaimer, setShowEmailDisclaimer] = useState(false);
  const [showPasswordDisclaimer, setShowPasswordDisclaimer] = useState(false);
  const [isOpen, setIsOpen] = useRecoilState(authModalState);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const closeModal = () => {
    setEmail("");
    setPassword("");
    setUsername("");

    setIsOpen(!isOpen);
  };

  const handleEmailSignUp = (email, password, username) => {
    console.log(username);
    if (!usernameRegex.test(username)) {
      setShowUsernameDisclaimer(true);
      return;
    } else if (!emailRegex.test(email)) {
      setShowEmailDisclaimer(true);
      return;
    } else if (password.length < 6) {
      setShowPasswordDisclaimer(true);
      return;
    } else {
      emailSignUp(email, password, username);
      closeModal();
    }
  };

  if (modalType === "SIGN_IN") {
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
              <div className="inline-block align-bottom bg-zinc-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full w-[95vw]">
                <div className="flex items-center px-1.5 py-2">
                  <div
                    className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                    onClick={() => closeModal()}
                  >
                    <XIcon className="h-[22px] text-white" />
                  </div>
                  <div className="pt-1 w-full flex justify-center">
                    <Image
                      src="/HowlerLogoColored.png"
                      alt="Holwer Logo"
                      height={30}
                      width={30}
                      className=""
                    />
                  </div>
                  <div className="w-9 h-9 flex items-center justify-center xl:px-0">
                    <XIcon className="h-[22px] text-transparent" />
                  </div>
                </div>
                <div className="h-[500px] flex justify-center bg-zinc-900 w-full px-10 py-5 text-white">
                  <div className="flex flex-col sm:w-7/12 w-full">
                    <h1 className="text-2xl font-bold">Sign in to Howler</h1>
                    <div className="flex flex-col mt-5 gap-3">
                      <div className="flex flex-col">
                        <div className="flex flex-col items-start">
                          <button
                            className="signInButton"
                            onClick={() => {
                              signInWithProvider("GOOGLE");
                              closeModal();
                            }}
                          >
                            <FcGoogle className="h-[22px] w-[22px] mr-1" />
                            Sign in with Google
                          </button>
                          <button
                            className="signInButton"
                            onClick={() => {
                              signInWithProvider("APPLE");
                              closeModal();
                            }}
                          >
                            <AiFillApple className="h-[22px] w-[22px] mr-1" />{" "}
                            Sign in with Apple
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="h-[1px] w-full bg-zinc-800"></div>
                        <p className="text-md text-white px-2 pb-1">or</p>
                        <div className="h-[1px] w-full bg-zinc-800"></div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="bg-transparent border border-zinc-700 border-1 p-3 rounded outline-none focus:border-rose-600 transition ease-out"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="" className="mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          className="bg-transparent border border-zinc-700 border-1 p-3 rounded outline-none focus:border-rose-600 transition ease-out"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <button
                        className="w-[160px] h-[40px] bg-rose-600 mx-auto my-4 rounded-full font-bold hover:bg-rose-800 transition ease-out"
                        onClick={() => {
                          emailSignIn(email, password);
                          closeModal();
                        }}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  } else {
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
              <div className="inline-block align-bottom bg-zinc-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full w-[95vw]">
                <div className="flex items-center px-1.5 py-2">
                  <div
                    className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                    onClick={() => closeModal()}
                  >
                    <XIcon className="h-[22px] text-white" />
                  </div>
                  <div className="pt-1 w-full flex justify-center">
                    <Image
                      src="/HowlerLogoColored.png"
                      alt="Holwer Logo"
                      height={30}
                      width={30}
                      className=""
                    />
                  </div>
                  <div className="w-9 h-9 flex items-center justify-center xl:px-0">
                    <XIcon className="h-[22px] text-transparent" />
                  </div>
                </div>
                <div className="h-[500px] bg-zinc-900 w-full px-10 py-5 text-white">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <div className="flex flex-col mt-5 gap-5">
                    <div className="flex flex-col">
                      <label htmlFor="" className="text-lg mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className="bg-transparent border border-zinc-700 border-1 p-4 rounded outline-none focus:border-rose-600 transition ease-out"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setShowUsernameDisclaimer(false);
                        }}
                      />
                      <p
                        className={`text-sm text-rose-600 ${
                          showUsernameDisclaimer ? "" : "hidden"
                        }`}
                      >
                        Invalid username. Username must not start with a number
                        or contain any symbols except &quot;_&quot;
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="text-lg mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="bg-transparent border border-zinc-700 border-1 p-4 rounded outline-none focus:border-rose-600 transition ease-out"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setShowEmailDisclaimer(false);
                        }}
                      />
                      <p
                        className={`text-sm text-rose-600 ${
                          showEmailDisclaimer ? "" : "hidden"
                        }`}
                      >
                        Invalid email, please enter a valid email address.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="" className="text-lg mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        className="bg-transparent border border-zinc-700 border-1 p-4 rounded outline-none focus:border-rose-600 transition ease-out"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setShowPasswordDisclaimer(false);
                        }}
                      />
                      <p
                        className={`text-sm text-rose-600 ${
                          showPasswordDisclaimer ? "" : "hidden"
                        }`}
                      >
                        Password must be at least 6 characters or more.
                      </p>
                    </div>
                    <button
                      className="w-[160px] h-[40px] bg-rose-600 mx-auto my-4 rounded-full font-bold hover:bg-rose-800 transition ease-out"
                      onClick={() => {
                        handleEmailSignUp(email, password, username);
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
};

export default AuthModal;
