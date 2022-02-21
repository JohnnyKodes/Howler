import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import Post from "../Post";

const categories = ["Howls", "Media"];
const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const UserFeed = ({ posts }) => {
  const [mediaPosts, setMediaPosts] = useState(
    posts.filter((post) => post.image)
  );

  return (
    <div>
      <Tab.Group>
        <Tab.List className="flex  space-x-1 bg-zinc-900 0 mt-10 border-b border-zinc-700">
          {categories.map((category, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 leading-5",
                  "",
                  selected
                    ? "selected font-bold"
                    : "text-[#d9d9d9] hover:bg-black/[0.08] hover:text-white transition ease-out duration-200"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            {posts.reverse().map((post) => (
              <Post
                key={`${post.id}/${Math.random()}}`}
                id={post.id}
                post={post}
              />
            ))}
          </Tab.Panel>
          <Tab.Panel>
            {posts.reverse().map((post) => {
              if (post.image) {
                return (
                  <Post
                    key={`${post.id}/${Math.random()}}`}
                    id={post.id}
                    post={post}
                  />
                );
              }
            })}
          </Tab.Panel>
          <Tab.Panel>3</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default UserFeed;
