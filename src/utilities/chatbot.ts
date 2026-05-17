import { sanitizeChatHtml } from "@/helpers/sanitizeChatHtml";
import { LOCAL_STORAGE_CHATBOT_GUEST_SESSION_KEY } from "./constants";
import {
  chatBotChatType,
  chatReplyReferenceType,
  chatRoleType,
  chatUiStatusType,
} from "./types";

export const CHAT_PAGE_STARTER_PROMPTS = [
  "Explain this policy in simple terms",
  "Compare third-party vs comprehensive insurance",
  "Help me understand my premium",
  "What documents do I need for a claim?",
  "Summarize this insurance quote",
  "What does comprehensive cover mean?",
];

export const CHAT_PAGE_EMPTY_STATE = {
  eyebrow: "Insure All The Way Assistant",
  title: "Ask Uju about your policy, quote, claim, or coverage",
  description:
    "Uju helps you understand insurance clearly, so you can make confident decisions without decoding industry jargon on your own.",
};

export const CHAT_WIDGET_EMPTY_STATE = {
  eyebrow: "Need help fast?",
  title: "Ask Uju a quick insurance question",
  description:
    "Get concise guidance on policies, claims, premiums, and coverage, then continue in the full assistant when you need more context.",
};

const createLocalId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const createGuestChatSessionId = () => {
  const generatedId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  return `guest-${generatedId}`.replace(/[^a-zA-Z0-9._-]/g, "-");
};

export const getOrCreateGuestChatSessionId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const existingGuestId = localStorage.getItem(
    LOCAL_STORAGE_CHATBOT_GUEST_SESSION_KEY,
  );

  if (existingGuestId) {
    return existingGuestId;
  }

  const nextGuestSessionId = createGuestChatSessionId();
  localStorage.setItem(
    LOCAL_STORAGE_CHATBOT_GUEST_SESSION_KEY,
    nextGuestSessionId,
  );
  return nextGuestSessionId;
};

export const getChatParticipantLabel = (role: chatRoleType) =>
  role === "assistant" ? "Uju" : "You";

export const getChatMessageSnippet = (message: string, maxLength = 120) => {
  const plainText = (message || "").replace(/\s+/g, " ").trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength - 1).trimEnd()}…`;
};

export const buildChatRequestMessage = ({
  message,
  replyTo,
}: {
  message: string;
  replyTo?: chatReplyReferenceType | null;
}) => {
  const trimmedMessage = message.trim();

  if (!replyTo) {
    return trimmedMessage;
  }

  const replySnippet = getChatMessageSnippet(replyTo.message, 180);

  return [
    `Replying to ${getChatParticipantLabel(replyTo.role)}: ${replySnippet}`,
    "",
    `My message: ${trimmedMessage}`,
  ].join("\n");
};

export const parseStoredChatMessage = (
  message: string,
  role: chatRoleType,
): Pick<chatBotChatType, "message" | "replyTo"> => {
  if (role !== "user") {
    return {
      message,
      replyTo: null,
    };
  }

  const matchedReplyMessage = message.match(
    /^Replying to (Uju|You): ([\s\S]*?)\n\nMy message: ([\s\S]+)$/u,
  );

  if (!matchedReplyMessage) {
    return {
      message,
      replyTo: null,
    };
  }

  const [, participantLabel, repliedSnippet, actualMessage] = matchedReplyMessage;

  return {
    message: actualMessage.trim(),
    replyTo: {
      _id: `reply-${participantLabel}-${repliedSnippet.slice(0, 24)}`,
      role: participantLabel === "Uju" ? "assistant" : "user",
      message: repliedSnippet.trim(),
    },
  };
};

export const getChatMessageCopyText = (message: chatBotChatType) => {
  if (message.role === "user") {
    return message.message;
  }

  if (typeof window === "undefined") {
    return message.message.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const safeHtml = sanitizeChatHtml(message.message);
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(safeHtml, "text/html");
  const extractedText = parsedDocument.body.textContent || "";

  return extractedText.replace(/\s+/g, " ").trim();
};

export const copyChatTextToClipboard = async (value: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export const createChatMessage = ({
  message,
  role,
  replyTo = null,
  status = "sent",
}: {
  message: string;
  role: chatRoleType;
  replyTo?: chatReplyReferenceType | null;
  status?: chatUiStatusType;
}): chatBotChatType => ({
  _id: createLocalId(),
  message,
  role,
  replyTo,
  status,
  createdAt: new Date().toISOString(),
});
