import { useState } from "react";
import { AiFillApple } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { authModalState, authModalType } from "../../atoms/modalAtom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { signInWithProvider } from "../../firebase/firebaseAuth";

const Login = () => {
  const [isOpen, setIsOpen] = useRecoilState(authModalState);
  const [modalType, setModalType] = useRecoilState(authModalType);

  return (
    <div className="text-white min-h-screen flex flex-col">
      <div className="text-white h-full flex flex-col-reverse lg:flex-row">
        <div className="bg-rose-600 lg:w-[55%] w-full flex justify-center items-center pt-5">
          <Image
            src="/HowlerLogo.png"
            alt="Howler Logo"
            height={350}
            width={350}
            className=""
          />
        </div>
        <div className="bg-zinc-900 h-full flex justify-center">
          <div className="md:w-9/12 w-10/12 h-full flex flex-col">
            <div className="pt-10 pb-10">
              <Image
                src="/HowlerLogoColored.png"
                alt="Howler Logo"
                height={50}
                width={50}
                className=""
              />
            </div>
            <div className="h-52">
              <h1 className="md:text-7xl text-6xl font-bold">
                Currently Happening
              </h1>
            </div>
            <h3 className="text-4xl font-bold mb-10">Join Howler Today.</h3>
            <div className="flex flex-col justify-start h-52 w-[300px]">
              <div className="flex flex-col items-start">
                <button
                  className="signInButton"
                  onClick={() => {
                    signInWithProvider("GOOGLE");
                  }}
                >
                  <FcGoogle className="h-[22px] w-[22px] mr-1" />
                  Sign in with Google
                </button>
                <button className="signInButton" onClick={() => test()}>
                  <AiFillApple className="h-[22px] w-[22px] mr-1" /> Sign in
                  with Apple
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-center items-center">
                  <div className="h-[1px] w-full bg-zinc-800"></div>
                  <p className="text-md text-white px-2 pb-1">or</p>
                  <div className="h-[1px] w-full bg-zinc-800"></div>
                </div>
                <button
                  className="w-full bg-rose-600 pt-2 pb-2 rounded-full hover:bg-rose-800 transition ease-out duration-300 font-bold"
                  onClick={() => {
                    setModalType("SIGN_UP");
                    setIsOpen(!isOpen);
                  }}
                >
                  Sign up with email
                </button>
                <p className="text-xs">
                  By signing up, you agree to the{" "}
                  <a
                    href=""
                    className="text-rose-500 cursor-pointer hover:underline"
                  >
                    Terms of Service{" "}
                  </a>{" "}
                  and{" "}
                  <a
                    href=""
                    className="text-rose-500 cursor-pointer hover:underline"
                  >
                    Privacy Policy{" "}
                  </a>{" "}
                  , including{" "}
                  <a
                    href=""
                    className="text-rose-500 cursor-pointer hover:underline"
                  >
                    Cookie Use.
                  </a>
                </p>
              </div>
            </div>
            <div className="w-[300px]">
              <h3 className="text-md font-bold mt-10">
                Already have an account ?
              </h3>
              <button
                className="w-full bg-transparent pt-2 pb-2 rounded-full mt-4 mb-6 border-zinc-600 border-[1px] hover:bg-rose-600 hover:bg-opacity-5 transition ease-out duration-300 text-rose-500 font-bold"
                onClick={() => {
                  setModalType("SIGN_IN");
                  setIsOpen(!isOpen);
                }}
              >
                Sign In with email
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-fit bg-zinc-900">
        <div className="px-10 py-3 w-full text-center text-zinc-400">
          {bottomTextLinks.map((link, index) => (
            <a href="" key={index} className="text-sm mr-4 hover:underline">
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const bottomTextLinks = [
  "About",
  "Help Center",
  "Terms of Service",
  "Privacy Policy",
  "Accessibility",
  "Ads info",
  "Blog",
  "Status",
  "Careers",
  "Brand Resources",
  "Advertising",
  "Marketing",
  "Twitter for Business",
  "Developers",
  "Directory",
  "Settings",
  "2022 Bulletin, Inc.",
];

export default Login;
