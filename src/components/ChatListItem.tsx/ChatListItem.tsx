import { useState } from "react";
import Link from "next/link";
import { PencilLine, Trash2, Check } from "lucide-react";
import Button from "../Button/Button";
import { conversationType, requestType } from "@/utilities/types";

interface Props {
  data: conversationType;
  isActive: boolean;
  handleDeleteConversation: (id: string) => void;
  handleRenameConversation: (id: string, title: string) => void;
  requestState: requestType;
  classes: any;
}

function ChatListItem({
  data,
  isActive,
  handleDeleteConversation,
  handleRenameConversation,
  requestState,
  classes,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data?.title || "New Conversation");

  const handleRename = async () => {
    if (!title.trim() || title === data?.title) {
      setIsEditing(false);
      return;
    }

    handleRenameConversation(data._id, title);
    setIsEditing(false);
  };

  return (
    <Link
      href={`/chat/${data?._id}`}
      key={data?._id}
      className={`${classes.chat} ${isActive ? classes.active : ""}`}
      onClick={(e) => {
        if (isEditing) e.preventDefault();
      }}
    >
      {isEditing ? (
        <input
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === "Enter" && handleRename()}
          className={classes.editInput}
        />
      ) : (
        <span>{title}</span>
      )}

      {isEditing ? (
        <Button
          title="Save"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRename();
          }}
          loading={
            requestState?.isLoading &&
            requestState?.id === "rename-conversation"
          }
        >
          <Check size={14} color="green" />
        </Button>
      ) : (
        <Button
          title="Rename this conversation"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
          }}
          loading={
            requestState?.isLoading &&
            requestState?.id === "rename-conversation"
          }
        >
          <PencilLine size={14} />
        </Button>
      )}

      <Button
        title="Delete Conversation"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDeleteConversation(data._id);
        }}
        loading={
          requestState?.isLoading && requestState?.id === "delete-conversation"
        }
      >
        <Trash2 size={14} color="red" />
      </Button>
    </Link>
  );
}

export default ChatListItem;
