import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";
import { api, type RouterOutputs } from "~/utils/api";
import Image from "next/image";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

const ChatView: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { data: sessionData } = useSession();

  const [messages, setMessages] = useState<
    RouterOutputs["message"]["getChatMessage"][]
  >([]);
  const [input, setInput] = useState("");
  const [messageId, setMessageId] = useState<string>("");

  const [isSending, setIsSending] = useState(false);

  const { mutate } = api.message.send.useMutation({
    onSuccess: () => {
      setInput("");
      setIsSending(false);
    },
    onMutate: () => {
      setIsSending(true);
    },
  });

  const { data: chatData } = api.message.getAll.useQuery({
    groupId,
  });

  useEffect(() => {
    if (chatData) {
      setMessages([...chatData]);
    }
  }, [chatData]);

  const { data: messageData } = api.message.getChatMessage.useQuery({
    id: messageId,
  });

  useEffect(() => {
    if (messageData) {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  }, [messageData]);

  useEffect(() => {
    const channel = pusher.subscribe(`chat-${groupId}`);
    channel.bind("message", (newMessageId: string) => {
      setMessageId(newMessageId.toString());
    });

    // Clean up
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${groupId}`);
    };
  }, [groupId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="max-h-fit max-w-full rounded-lg bg-[#405340]">
      <div className="messages px-300 flex flex-col items-center justify-center gap-12 py-2">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`message flex flex-col ${
              message?.sender.name === sessionData?.user.name
                ? "items-end"
                : "items-start"
            } justify-start gap-2 px-2 py-2 ${
              message?.sender.name === sessionData?.user.name
                ? "self-end"
                : "self-start"
            }`}
          >
            {message?.sender.name !== sessionData?.user.name && (
              <>
                <div className="flex items-center">
                  <Image
                    className="mr-2 h-11 w-11 rounded-full"
                    src={message?.sender.image ?? ""}
                    alt="User Profile"
                    width={44}
                    height={44}
                  />
                  <h1 className="text-xl font-bold text-[#1CCDB3]">
                    {message?.sender.name}
                  </h1>
                </div>
                <p className="px-16 text-left text-xl font-semibold text-gray-300">
                  {message?.content}
                </p>
              </>
            )}
            {message?.sender.name === sessionData?.user.name && (
              <>
                <div className="flex items-center justify-end">
                  <h1 className="text-xl font-bold text-[#E49A0A]">
                    {message?.sender.name}
                  </h1>
                  <Image
                    className="ml-2 mt-2 h-11 w-11 rounded-full"
                    src={sessionData?.user.image ?? ""}
                    alt="User Profile"
                    width={44}
                    height={44}
                  />
                </div>
                <p className="px-16 text-right text-xl font-semibold text-gray-300">
                  {message?.content}
                </p>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.length < 1) return;
          mutate({ groupId, content: input });
          }}
        className="flex items-center justify-between p-2 gap-2 sticky bottom-0"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-xl font-semibold text-primary placeholder:text-gray-400 bg-secondary border-2 border-accent p-2 focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-secondary font-semibold text-primary"
          disabled={isSending}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatView;
