import ChatLayout from "@/layouts/ChatLayout/ChatLayout";

interface Props {
  children: React.ReactNode;
}

const layout: React.FC<Props> = ({ children }) => {
  return <ChatLayout>{children}</ChatLayout>;
};

export default layout;
