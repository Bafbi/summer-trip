import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { api } from "~/utils/api";

// Mettre les clés pusher dans les variables d'environnement
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
});

const ChatView: React.ComponentType<{groupId: string}> = ({ groupId }) => {

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState(''); // Pour stocker l'input de l'utilisateur
  
  const {mutate}= api.message.send.useMutation({
    onSuccess:()=>{
      setInput("")
    }
  })

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({content:input, groupId});
  };

  useEffect(() => {
    const channel = pusher.subscribe(`chat-${groupId}`);
    channel.bind('message', (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${groupId}`);
    };
  }, [groupId]);  // Re-subscribe when groupId changes

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {messages.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
        <form onSubmit={sendMessage}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;