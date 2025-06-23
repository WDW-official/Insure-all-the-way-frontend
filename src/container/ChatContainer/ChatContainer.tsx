"use client";

import Logo from "@/components/Logo/Logo";
import classes from "./ChatContainer.module.css";
import Phone from "@/assets/svgIcons/Phone";
import Send from "@/assets/svgIcons/Send";
import { chat } from "@/utilities/dummyConstants";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { capitalize } from "@/helpers/capitalize";

type ChatContainerTypes = {
  isOpen: boolean;
};

const ChatContainer = ({ isOpen }: ChatContainerTypes) => {
  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  //   States
  const [chatsState, setChatsState] = useState(chat);
  const [message, setMessage] = useState("");

  //   COntext
  const { user } = useContext(AuthContext);

  //   Utils

  const handleMessageSend = () => {
    setChatsState((prevState) => {
      return [...prevState, { message, sender: "user" }];
    });
    setMessage("");

    setTimeout(() => {
      handleMessageScrollToBottom();
    }, 500);
  };

  const handleMessageScrollToBottom = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        behavior: "smooth",
        top: containerRef.current.scrollHeight,
        left: 0,
      });
    }
  };

  //   Effects
  useEffect(() => {
    handleMessageScrollToBottom();
  }, [isOpen]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Logo dimensions={{ width: 60, height: 45 }} />
        <h3>
          Welcome
          {user?.firstName &&
            `, ${capitalize(user?.firstName as string) || ""}`}
        </h3>
        <a href="">
          <Phone />
        </a>
      </div>
      <div className={classes.chatContainer}>
        <div className={classes.chats} ref={containerRef}>
          {chatsState.map((data) => {
            return (
              <div
                className={`${classes.chat} ${
                  classes[data.sender?.toLowerCase()]
                }`}
              >
                <div>{data?.message}</div>
                <p>
                  {data?.sender?.toLowerCase() === "bot"
                    ? "Bot"
                    : user?.firstName || data?.sender}
                </p>
              </div>
            );
          })}
        </div>
        <form className={classes.form}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && message?.trim()) {
                e.preventDefault();
                handleMessageSend();
              }
            }}
          />
          <button
            onClick={() => {
              handleMessageSend();
            }}
            disabled={!message}
          >
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
