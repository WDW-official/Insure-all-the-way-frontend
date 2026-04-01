"use client";

import Button from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import { AuthContext } from "@/context/AuthContext";
import useError from "@/hooks/useError";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { useConversationChats, useConversations } from "@/hooks/useChats";
import {
  CHATBOT_CONVERSATIONS_KEY,
  createChatConversation,
  sendChatMessage,
} from "@/services/chatbot";
import {
  buildChatRequestMessage,
  CHAT_PAGE_STARTER_PROMPTS,
  CHAT_WIDGET_EMPTY_STATE,
  createChatMessage,
  parseStoredChatMessage,
} from "@/utilities/chatbot";
import {
  chatBotChatType,
  chatReplyReferenceType,
  conversationType,
} from "@/utilities/types";
import { ArrowUpRight, LockKeyhole, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatPrompt from "../ChatPrompt/ChatPrompt";
import classes from "./ChatContainer.module.css";

type ChatContainerTypes = {
  isOpen: boolean;
};

const ChatContainer = ({ isOpen }: ChatContainerTypes) => {
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<chatBotChatType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [replyToMessage, setReplyToMessage] =
    useState<chatReplyReferenceType | null>(null);

  const { user } = useContext(AuthContext);
  const { errorFlowFunction } = useError();
  const { updateSearchParams } = useUpdateSearchParams();

  const { data: conversationData, isLoading: conversationsIsLoading } =
    useConversations(Boolean(user) && isOpen);
  const { data: chatsData, isLoading: chatsIsLoading } = useConversationChats(
    Boolean(user) && isOpen ? activeConversationId || undefined : undefined,
  );

  const conversations: conversationType[] = useMemo(
    () => conversationData?.data?.conversations || [],
    [conversationData],
  );

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === activeConversationId,
      ) || conversations[0],
    [activeConversationId, conversations],
  );

  useEffect(() => {
    if (!user || !isOpen) {
      return;
    }

    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0]._id);
    }
  }, [activeConversationId, conversations, isOpen, user]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      setReplyToMessage(null);
      return;
    }

    if (chatsData?.data?.chats) {
      setMessages(
        chatsData.data.chats.map((message: chatBotChatType) => {
          const parsedMessage = parseStoredChatMessage(
            message.message,
            message.role,
          );

          return {
            ...message,
            ...parsedMessage,
            status: "sent" as const,
          };
        }),
      );
    }
  }, [activeConversationId, chatsData]);

  useEffect(() => {
    setReplyToMessage(null);
  }, [activeConversationId]);

  const ensureConversation = async () => {
    if (activeConversationId) {
      return activeConversationId;
    }

    setIsCreatingConversation(true);

    try {
      const response = await createChatConversation();
      const createdConversationId = response?.data?.conversation?._id;

      setActiveConversationId(createdConversationId);
      mutate(CHATBOT_CONVERSATIONS_KEY);

      return createdConversationId;
    } catch (error) {
      errorFlowFunction(error);
      return null;
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const sendMessageToAssistant = async (
    messageText: string,
    messageId?: string,
    replyReference: chatReplyReferenceType | null = null,
  ) => {
    if (!messageText.trim() || !user) {
      return;
    }

    const conversationId = await ensureConversation();

    if (!conversationId) {
      return;
    }

    const pendingUserMessage = messageId
      ? null
      : createChatMessage({
          message: messageText,
          role: "user",
          replyTo: replyReference,
          status: "pending",
        });
    const targetMessageId = messageId || pendingUserMessage?._id;

    setIsSending(true);
    setReplyToMessage(null);

    setMessages((prevState) => {
      if (!messageId && pendingUserMessage) {
        return [...prevState, pendingUserMessage];
      }

      return prevState.map((message) =>
        message._id === targetMessageId
          ? { ...message, status: "pending" as const }
          : message,
      );
    });

    try {
      const response = await sendChatMessage({
        conversationId,
        message: buildChatRequestMessage({
          message: messageText,
          replyTo: replyReference,
        }),
        userId: user?._id,
      });

      setMessages((prevState) => {
        const nextState = prevState.map((message) =>
          message._id === targetMessageId
            ? {
                ...message,
                status: "sent" as const,
              }
            : message,
        );

        return [
          ...nextState,
          createChatMessage({
            message: response?.data?.reply,
            role: "assistant",
          }),
        ];
      });

      mutate(CHATBOT_CONVERSATIONS_KEY);
    } catch (error) {
      setMessages((prevState) =>
        prevState.map((message) =>
          message._id === targetMessageId
            ? {
                ...message,
                status: "retryable" as const,
              }
            : message,
        ),
      );

      errorFlowFunction(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleRetryMessage = (messageId: string) => {
    const messageToRetry = messages.find(
      (message) => message._id === messageId,
    );

    if (!messageToRetry) {
      return;
    }

    sendMessageToAssistant(
      messageToRetry.message,
      messageId,
      messageToRetry.replyTo || null,
    );
  };

  if (!user) {
    return (
      <div className={classes.container}>
        <div className={classes.lockedState}>
          <div className={classes.lockIcon}>
            <LockKeyhole size={20} />
          </div>
          <h3>Chat with Uju after you sign in</h3>
          <p>
            Your assistant works best with your policy context, claims history,
            and saved conversations.
          </p>
          <Button
            onClick={() => updateSearchParams("auth", "sign-in", "set")}
            type="secondary"
          >
            Sign in to continue
          </Button>
        </div>
      </div>
    );
  }

  const currentConversationId = activeConversation?._id || activeConversationId;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <Logo dimensions={{ width: 44, height: 32 }} />

          <div className={classes.headerCopy}>
            <h3>Uju</h3>
          </div>
        </div>

        <div className={classes.headerActions}>
          {activeConversation?.title && (
            <div className={classes.currentConversation}>
              <MessageSquareText size={15} />
              <span>{activeConversation.title}</span>
            </div>
          )}

          <Link
            className={classes.fullAssistantLink}
            href={
              currentConversationId ? `/chat/${currentConversationId}` : "/chat"
            }
          >
            Full assistant
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className={classes.messagesArea}>
        <ChatMessages
          chatsIsLoading={Boolean(activeConversationId) && chatsIsLoading}
          emptyState={CHAT_WIDGET_EMPTY_STATE}
          isLoading={
            isSending || isCreatingConversation || conversationsIsLoading
          }
          messages={messages}
          onPromptSelect={(prompt) =>
            sendMessageToAssistant(prompt, undefined, replyToMessage)
          }
          onReply={setReplyToMessage}
          onRetry={handleRetryMessage}
          starterPrompts={CHAT_PAGE_STARTER_PROMPTS.slice(0, 2)}
          variant="widget"
        />
      </div>

      <ChatPrompt
        disabled={isCreatingConversation}
        loading={isSending}
        onCancelReply={() => setReplyToMessage(null)}
        onSend={(message) =>
          sendMessageToAssistant(message, undefined, replyToMessage)
        }
        placeholder="Ask about a quote, claim, or coverage…"
        replyTo={replyToMessage}
        variant="widget"
      />
    </div>
  );
};

export default ChatContainer;
