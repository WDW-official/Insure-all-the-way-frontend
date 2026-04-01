"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Logo from "@/components/Logo/Logo";
import Modal from "@/components/Modal/Modal";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import useError from "@/hooks/useError";
import {
  CHATBOT_CONVERSATIONS_KEY,
  createChatConversation,
  deleteChatConversation,
  renameChatConversation,
} from "@/services/chatbot";
import { conversationType } from "@/utilities/types";
import {
  ArrowLeftToLine,
  Loader,
  PencilLine,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useMemo, useState } from "react";
import { mutate } from "swr";
import classes from "./ChatSideBar.module.css";

interface Props {
  activeConversationId?: string;
  conversations: conversationType[];
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
}

type RenameState = {
  conversationId: string;
  isOpen: boolean;
  title: string;
};

const ChatSideBar: React.FC<Props> = ({
  activeConversationId,
  conversations,
  isOpen,
  loading,
  onClose,
}) => {
  const { user } = useContext(AuthContext);
  const { errorFlowFunction } = useError();
  const { showToast } = useToast();

  const pathname = usePathname();
  const router = useRouter();

  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<
    string | null
  >(null);
  const [isRenamingConversation, setIsRenamingConversation] = useState(false);
  const [renameState, setRenameState] = useState<RenameState>({
    conversationId: "",
    isOpen: false,
    title: "",
  });

  const fullName = useMemo(() => {
    if (!user?.firstName && !user?.lastName) {
      return "User";
    }

    return `${user?.lastName || ""} ${user?.firstName || ""}`.trim();
  }, [user?.firstName, user?.lastName]);

  const handleCreateConversation = async () => {
    try {
      setIsCreatingConversation(true);
      const response = await createChatConversation();

      mutate(CHATBOT_CONVERSATIONS_KEY);
      router.push(`/chat/${response?.data?.conversation?._id}`);
      onClose();
    } catch (error) {
      errorFlowFunction(error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      setDeletingConversationId(conversationId);
      const response = await deleteChatConversation(conversationId);

      mutate(CHATBOT_CONVERSATIONS_KEY);
      showToast(response?.data?.message, "success");

      if (activeConversationId === conversationId) {
        router.push("/chat");
      }

      onClose();
    } catch (error) {
      errorFlowFunction(error);
    } finally {
      setDeletingConversationId(null);
    }
  };

  const handleRenameConversation = async () => {
    if (!renameState.title.trim()) {
      showToast("Please enter a conversation name", "error");
      return;
    }

    try {
      setIsRenamingConversation(true);
      await renameChatConversation(
        renameState.conversationId,
        renameState.title.trim(),
      );

      mutate(CHATBOT_CONVERSATIONS_KEY);
      showToast("Conversation renamed successfully", "success");
      setRenameState({
        conversationId: "",
        isOpen: false,
        title: "",
      });
    } catch (error) {
      errorFlowFunction(error);
    } finally {
      setIsRenamingConversation(false);
    }
  };

  return (
    <>
      {renameState.isOpen && (
        <Modal
          onClick={() =>
            setRenameState({
              conversationId: "",
              isOpen: false,
              title: "",
            })
          }
          body={
            <div className={classes.renameModal}>
              <div>
                <h3>Rename conversation</h3>
                <p>Give this conversation a title that will be easy to find later.</p>
              </div>

              <Input
                autoFocus
                label="Conversation name"
                onChange={(event) =>
                  setRenameState((prevState) => ({
                    ...prevState,
                    title: event.target.value,
                  }))
                }
                value={renameState.title}
              />

              <div className={classes.renameModalActions}>
                <Button
                  onClick={() =>
                    setRenameState({
                      conversationId: "",
                      isOpen: false,
                      title: "",
                    })
                  }
                  type="grey"
                >
                  Cancel
                </Button>
                <Button
                  loading={isRenamingConversation}
                  onClick={handleRenameConversation}
                >
                  Save
                </Button>
              </div>
            </div>
          }
        />
      )}

      <aside
        className={`${classes.container} ${
          isOpen ? classes.open : ""
        }`}
      >
        <div className={classes.main}>
          <div className={classes.topSection}>
            <Logo dimensions={{ width: 65, height: 45 }} />

            <Button title="Close conversations" type="tertiary" onClick={onClose}>
              <ArrowLeftToLine size={16} />
            </Button>
          </div>

          <div className={classes.intro}>
            <span>Conversations</span>
          </div>

          <Button
            className={classes.newChatButton}
            loading={isCreatingConversation}
            onClick={handleCreateConversation}
          >
            <Plus size={14} strokeWidth={2} />
            <span>New Conversation</span>
          </Button>

          {loading ? (
            <div className={classes.loader}>
              <Loader className="animate-spin" size={16} />
            </div>
          ) : (
            <div className={classes.chatList}>
              {conversations?.length === 0 ? (
                <div className={classes.emptyState}>
                  <p>Your insurance conversations will appear here.</p>
                </div>
              ) : (
                conversations?.map((conversation) => {
                  const isActive =
                    activeConversationId === conversation?._id ||
                    pathname.includes(conversation?._id);

                  return (
                    <Link
                      className={`${classes.chat} ${
                        isActive ? classes.active : ""
                      }`}
                      href={`/chat/${conversation?._id}`}
                      key={conversation?._id}
                      onClick={onClose}
                    >
                      <div className={classes.chatCopy}>
                        <span>{conversation?.title || "New Conversation"}</span>
                        <p>{conversation?.lastMessage || "Start a new question with Uju"}</p>
                      </div>

                      <div className={classes.chatActions}>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setRenameState({
                              conversationId: conversation?._id,
                              isOpen: true,
                              title: conversation?.title || "",
                            });
                          }}
                          title="Rename conversation"
                          type="tertiary"
                        >
                          <PencilLine size={14} />
                        </Button>

                        <Button
                          loading={deletingConversationId === conversation?._id}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleDeleteConversation(conversation?._id);
                          }}
                          title="Delete conversation"
                          type="tertiary"
                        >
                          <Trash2 color="red" size={14} />
                        </Button>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>

        <Link className={classes.user} href="/dashboard" onClick={onClose}>
          <User size={16} />
          <span>{fullName}</span>
        </Link>
      </aside>
    </>
  );
};

export default ChatSideBar;
