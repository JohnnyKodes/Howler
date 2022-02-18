import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {},
});

export const commentModalState = atom({
  key: "commentModalState",
  default: false,
});

export const authModalState = atom({
  key: "authModalState",
  default: false,
});

export const authModalType = atom({
  key: "authModalType",
  default: "",
});

export const postIdState = atom({
  key: "postIdState",
  default: "",
});
