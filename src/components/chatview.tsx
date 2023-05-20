import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";
import { api, type RouterOutputs } from "~/utils/api";

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

  const { mutate } = api.message.send.useMutation({
    onSuccess: () => {
      setInput("");
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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ content: input, groupId });
  };

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

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
      <div className="max-w-full max-h-fit rounded-lg bg-[#405340]">
        <div className="messages flex flex-col items-center justify-center gap-12 px-300 py-2">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`message flex flex-col ${
                message?.sender.name === sessionData?.user.name
                  ? "items-end"
                  : "items-start"
              } justify-start gap-2 px-4 py-2 ${
                message?.sender.name === sessionData?.user.name
                  ? "self-end"
                  : "self-start"
              }`}
            >
              
              {message?.sender.name !== sessionData?.user.name && (
                <>
                  <div className="flex items-center">
                    <img
                      className="w-11 h-11 rounded-full mr-2"
                      src={message?.sender.image ?? ""}
                      alt="User Profile"
                    />
                    <h1 className="text-[#1CCDB3] text-xl font-bold">
                      {message?.sender.name}
                    </h1>
                  </div>
                  <p className="text-gray-300 text-left text-xl px-16 font-semibold">
                    {message?.content}
                  </p>
                </>
              )}
              {message?.sender.name === sessionData?.user.name && (
                <>
                  <div className="flex items-center justify-end">
                    <h1 className="text-[#E49A0A] text-xl font-bold">
                      {message?.sender.name}
                    </h1>
                    <img
                      className="w-11 h-11 rounded-full mt-2 ml-2"
                      src={sessionData?.user.image ?? ""}
                      alt="User Profile"
                    />
                  </div>
                  <p className="text-gray-300 text-right text-xl px-16 font-semibold">
                    {message?.content}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
        <form
          onSubmit={sendMessage}
          className="flex items-center justify-between px-0 py-2"
          ref={formRef}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="zoneText flex-grow rounded-lg bg-gray-100 font-semibold px-3 py-5 focus:outline-none"
          />
          <button
            type="submit"
            className="publierMessage ml-1 rounded-lg bg-[#E49A0A] px-4 py-5 font-semibold text-gray-200 hover:bg-[#1CCDB3]"
          >
            Send
          </button>
        </form>
      </div>
  );
};

export default ChatView;
