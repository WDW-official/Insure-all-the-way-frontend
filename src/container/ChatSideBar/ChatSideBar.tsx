import Button from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { requestHandler } from "@/helpers/requestHandler";
import useError from "@/hooks/useError";
import { routes } from "@/utilities/routes";
import { conversationType, requestType } from "@/utilities/types";
import {
  ArrowLeftToLine,
  Loader,
  PencilLine,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { mutate } from "swr";
import classes from "./ChatSideBar.module.css";

interface Props {
  loading: boolean;
  conversations: conversationType[];
}

const ChatSideBar: React.FC<Props> = ({ loading, conversations }) => {
  // Context
  const { user } = useContext(AuthContext);

  const fullname = `${user?.lastName} ${user?.firstName}`;

  // Router
  const pathname = usePathname();
  const router = useRouter();
  const { chatId } = useParams();

  // Hooks
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  // States
  const [requestState, setRequestState] = useState<requestType>({
    isLoading: false,
    data: null,
    error: null,
  });

  // Requests
  const handleCreateNewConversation = () => {
    requestHandler({
      url: "/chatbot/conversations",
      method: "POST",
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        router.push(`/chat/${res?.data?.conversation?._id}`);
        mutate("/chatbot/conversations");
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
      id: "create-conversation",
    });
  };

  const handleDeleteConversation = (id: string) => {
    requestHandler({
      url: `/chatbot/conversations/${id}`,
      method: "DELETE",
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        mutate("/chatbot/conversations");
        showToast(res?.data?.message, "success");

        router.push("/chat");
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
      id: "delete-conversation",
    });
  };

  return (
    <section className={classes.container}>
      <div className={classes.main}>
        <div>
          <Logo dimensions={{ width: 65, height: 45 }} />

          <Button type="tertiary" title="Close Side-bar">
            <ArrowLeftToLine size={16} />
          </Button>
        </div>

        <Button
          title="Close Side-bar"
          className={classes.newChatButton}
          onClick={handleCreateNewConversation}
          loading={
            requestState?.isLoading &&
            requestState?.id === "create-conversation"
          }
        >
          <Plus size={16} strokeWidth={2} />
          <span>New Conversation</span>
        </Button>

        {loading ? (
          <div className={classes.loader}>
            <Loader size={16} className={`animate-spin`} />
          </div>
        ) : (
          <div className={classes.chatList}>
            <h4>Your Conversations</h4>

            <div>
              {conversations?.map((data) => {
                const isActive = pathname.includes(data?._id);
                return (
                  <Link
                    href={`/chat/${data?._id}`}
                    key={data?._id}
                    className={`${classes.chat} ${isActive && classes.active}`}
                  >
                    <span>{data?.title || "New Conversation"}</span>

                    <Button title="Rename this conversation">
                      <PencilLine size={14} />
                    </Button>
                    <Button
                      title="Delete Conversation"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteConversation(data?._id);
                      }}
                      loading={
                        requestState?.isLoading &&
                        requestState?.id === "delete-conversation"
                      }
                    >
                      <Trash2 size={14} color="red" />
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Link href={routes.DASHBOARD} className={classes.user}>
        <User size={16} />
        <span>{fullname || "User"}</span>
      </Link>
    </section>
  );
};

export default ChatSideBar;
