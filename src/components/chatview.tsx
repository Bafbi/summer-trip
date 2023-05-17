import { use, useEffect, useState } from "react";
import { RouterInputs, type RouterOutputs, api } from "~/utils/api";

import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import { useRouter } from "next/router";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "eu",
});

const ChatView: React.FC<{ groupId: string }> = ({ groupId }) => {
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

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-8">
          {messages.map((message, i) => (
            <div
              key={i}
              className="flex flex-col items-start justify-start gap-2 px-4 py-2"
            >
              <h1 className="text-2xl font-bold">{message?.sender?.name}</h1>
              <p className="text-gray-600">{message?.content}</p>
            </div>
          ))}
          <form
            onSubmit={sendMessage}
            className="flex items-center justify-between px-4 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Type a message..."
              className="flex-grow rounded-lg bg-gray-100 px-4 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-4 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
