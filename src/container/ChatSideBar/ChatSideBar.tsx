import Button from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import { routes } from "@/utilities/routes";
import { ArrowLeftToLine, Plus, User } from "lucide-react";
import Link from "next/link";
import classes from "./ChatSideBar.module.css";

const ChatSideBar = () => {
  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <div>
          <Logo dimensions={{ width: 65, height: 45 }} />

          <Button type="tertiary" title="Close Side-bar">
            <ArrowLeftToLine size={16} />
          </Button>
        </div>

        <Button title="Close Side-bar" className={classes.newChatButton}>
          <Plus size={16} strokeWidth={2} />
          <span>New Chat</span>
        </Button>

        <div className={classes.chatList}>
          <h4>Your Conversations</h4>

          <div>
            {[...Array(10)].map((data) => {
              return (
                <div key={data} className={classes.chat}>
                  <span>New Chat</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Link href={routes.DASHBOARD} className={classes.user}>
        <User size={16} />
        <span>Ezimorah Tobenna</span>
      </Link>
    </section>
  );
};

export default ChatSideBar;
