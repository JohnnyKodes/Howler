import { useState, useRef } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/modalAtom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { db, storage } from "../../firebase/firebase";

const Input = () => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const filePickerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userState);

  const addImageToPost = (e) => {
    console.log(e.target.files[0], "file");

    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: user.id,
      username: user.username,
      userProfilePicture: user.profilePicture,
      userTag: user.tag,
      postText: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadUrl,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);
  };

  console.log(user);

  return (
    <div
      className={`border-b border-zinc-700 p-3 flex space-x-3 overflow-y-scroll ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={user.profilePicture}
        alt="profile picture"
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="w-full divide-y divide-zinc-700">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="2"
            placeholder="What's on your mind?"
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-zinc-500 tracking-wide w-full min-h-[50px]"
          />
          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() =>
                  setSelectedFile({
                    rawFile: null,
                    image: null,
                  })
                }
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="h-[22px] text-rose-600" />
                <input
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="text-rose-600 h-[22px]" />
              </div>
              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="text-rose-600 h-[22px]" />
              </div>
              <div className="icon">
                <CalendarIcon className="text-rose-600 h-[22px]" />
              </div>

              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: 72,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                  color="#F43F5E"
                />
              )}
            </div>
            <button
              className="bg-rose-600 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-rose-700 disabled:hover:bg-rose-500 disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Howl
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Input;
