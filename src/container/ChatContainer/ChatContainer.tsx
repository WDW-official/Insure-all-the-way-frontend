"use client";

import Logo from "@/components/Logo/Logo";
import classes from "./ChatContainer.module.css";
import Phone from "@/assets/svgIcons/Phone";
import Send from "@/assets/svgIcons/Send";
import { chat } from "@/utilities/dummyConstants";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { capitalize } from "@/helpers/capitalize";
import { requestHandler } from "@/helpers/requestHandler";
import { chatType, requestType } from "@/utilities/types";
import useError from "@/hooks/useError";
import { CircularProgress } from "@mui/material";
import { SyncLoader } from "react-spinners";

type ChatContainerTypes = {
  isOpen: boolean;
};

const ChatContainer = ({ isOpen }: ChatContainerTypes) => {
  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  //   States
  const [chatsState, setChatsState] = useState<chatType[]>(chat);
  const [message, setMessage] = useState("");
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  //   COntext
  const { user } = useContext(AuthContext);

  // Hooks
  const { errorFlowFunction } = useError();

  //   Utils
  const handleMessageSend = (message: string, role: string) => {
    setChatsState((prevState) => {
      return [
        ...prevState,
        { message, sender: role, id: role, loading: false },
      ];
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

  const handleSendChatRequest = () => {
    const loadingId = String(Date.now());

    setTimeout(() => {
      setChatsState((prev) => [
        ...prev,
        { id: loadingId, message: "...", sender: "bot", loading: true },
      ]);
      handleMessageScrollToBottom();
    }, 500);

    requestHandler({
      url: `${process.env.NEXT_PUBLIC_CHATBOT_BACKEND_API_URL}/chat`,
      data: {
        message,
        user_id: user?.email,
      },
      method: "POST",
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        setChatsState((prev) =>
          prev.map((chat) =>
            chat.id === loadingId
              ? {
                  id: loadingId,
                  message: res?.data?.reply,
                  sender: "bot",
                  loading: false,
                }
              : chat
          )
        );
        handleMessageScrollToBottom();
      },
      errorFunction(err) {
        setChatsState((prev) =>
          prev.map((chat) =>
            chat.id === loadingId
              ? {
                  id: loadingId,
                  message: "Something went wrong ❌",
                  sender: "bot",
                  loading: false,
                }
              : chat
          )
        );

        errorFlowFunction(err);
      },
    });
  };

  //   Effects
  useEffect(() => {
    handleMessageScrollToBottom();
  }, [isOpen]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Logo dimensions={{ width: 50, height: 35 }} />
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
          {chatsState.map((data, i) => {
            if (data?.loading) {
              return (
                <div key={1} className={`${classes.chat} ${classes.loading}`}>
                  <div>
                    <SyncLoader size={6} color="#a7c7e7" />
                  </div>
                  <p>Uju</p>
                </div>
              );
            }
            return (
              <div
                className={`${classes.chat} ${
                  classes[data.sender?.toLowerCase()]
                }`}
                key={i}
              >
                <div dangerouslySetInnerHTML={{ __html: data?.message }}></div>
                <p>
                  {data?.sender?.toLowerCase() === "bot"
                    ? "Uju"
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
                handleMessageSend(message, "You");
                handleSendChatRequest();
              }
            }}
          />
          <button
            onClick={() => {
              handleMessageSend(message, "You");
              handleSendChatRequest();
            }}
            disabled={!message || requestState?.isLoading}
          >
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
