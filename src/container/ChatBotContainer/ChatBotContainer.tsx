import ChatBubble from "@/assets/svgIcons/ChatBubble";
import classes from "./ChatBotContainer.module.css";
import ChatContainer from "../ChatContainer/ChatContainer";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/context/ChatbotContext";
import Close from "@/assets/svgIcons/Close";
import { Sparkles } from "lucide-react";

const ChatBotContainer = () => {
  // COntext
  const { isOpen, handleOpenChatContainer, handleCloseChatContainer } =
    useContext(ChatContext);

  //   Refs
  const chatRef = useRef<HTMLDivElement | null>(null);

  //   Effects
  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleCloseChat = (e: any) => {
        if (chatRef.current && !chatRef.current.contains(e.target)) {
          handleCloseChatContainer();
        }
      };

      document.addEventListener("mousedown", handleCloseChat);

      return () => {
        document.removeEventListener("mousedown", handleCloseChat);
      };
    }
  }, []);

  return (
    <section className={classes.container} ref={chatRef}>
      <div
        className={classes.chatContainer}
        style={isOpen ? { maxHeight: "1300px" } : { maxHeight: "0px" }}
      >
        <ChatContainer isOpen={isOpen} />
      </div>

      <div
        className={classes["ai-link"]}
        onClick={handleOpenChatContainer}
        style={
          isOpen
            ? {
                // borderRadius: "50%",
                // transform: "rotate(90deg)",
                backgroundColor: "rgb(212, 47, 47)",
              }
            : { borderRadius: "10px" }
        }
      >
        {!isOpen ? (
          <>
            Talk insurance with Uju
            <Sparkles size={16} />
          </>
        ) : (
          <Close noBg dimensions={{ width: "20px", height: "20px" }} />
        )}
      </div>
    </section>
  );
};

export default ChatBotContainer;
