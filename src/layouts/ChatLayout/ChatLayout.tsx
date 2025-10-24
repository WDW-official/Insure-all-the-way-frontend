import ChatPrompt from "@/container/ChatPrompt/ChatPrompt";
import ChatSideBar from "@/container/ChatSideBar/ChatSideBar";
import classes from "./ChatLayout.module.css";

interface Props {
  children: React.ReactNode;
}

const ChatLayout: React.FC<Props> = ({ children }) => {
  return (
    <section className={classes.container}>
      <ChatSideBar />
      <section className={classes.children}>
        {children}

        <ChatPrompt />
      </section>

      <div className={classes.ellipse1}></div>
      <div className={classes.ellipse2}></div>
    </section>
  );
};

export default ChatLayout;
