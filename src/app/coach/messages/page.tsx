"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare, Send, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function MessagesPage() {
  const { user, userData } = useAuth();
  const orgId = userData?.organizationId || "";
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: users, loading } = useRealtimeData("users", [
    where("organizationId", "==", orgId)
  ]);
  
  const athletes: any[] = users.filter((u: any) => u.accountType === "athlete");

  useEffect(() => {
    if (!user?.uid || !activeChat || !orgId) {
      setMessages([]);
      return;
    }

    const chatId = [user.uid, activeChat].sort().join("_");
    
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user?.uid, activeChat, orgId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeChat || !user?.uid) return;

    const chatId = [user.uid, activeChat].sort().join("_");
    const textToSend = messageText.trim();
    setMessageText("");

    try {
      await addDoc(collection(db, "messages"), {
        chatId,
        senderId: user.uid,
        receiverId: activeChat,
        organizationId: orgId,
        text: textToSend,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!orgId) return null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-[1600px] mx-auto pb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <MessageSquare size={32} />
          Comms Hub
        </h1>
        <p className="text-muted-foreground mt-1">Direct messaging and team announcements.</p>
      </div>

      <Card glass className="flex-1 overflow-hidden flex border-white/10">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input className="pl-9 bg-white/5 border-none" placeholder="Search athletes..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {athletes.map((athlete: any) => (
              <button
                key={athlete.uid}
                onClick={() => setActiveChat(athlete.uid)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeChat === athlete.uid ? "bg-primary/20" : "hover:bg-white/5"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                  {athlete.firstName?.[0] || ""}{athlete.lastName?.[0] || ""}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold truncate">{athlete.firstName} {athlete.lastName}</p>
                  <p className="text-xs text-muted-foreground">Athlete</p>
                </div>
              </button>
            ))}
            {athletes.length === 0 && !loading && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No athletes in your organization yet.
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/40">
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState 
                compact
                icon={<MessageSquare size={32} />}
                title="Your Messages"
                description="Select an athlete to start a conversation."
                className="border-none bg-transparent"
              />
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {athletes.find((a: any) => a.uid === activeChat)?.firstName?.[0] || "A"}
                  </div>
                  <div>
                    <h3 className="font-bold">{athletes.find((a: any) => a.uid === activeChat)?.firstName} {athletes.find((a: any) => a.uid === activeChat)?.lastName}</h3>
                    <p className="text-xs text-emerald-500">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No messages yet. Send a message to start the conversation!
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.uid;
                  return (
                    <div key={msg.id} className={`flex gap-4 ${isMe ? "justify-end" : ""}`}>
                      {!isMe && <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center font-bold text-xs">{athletes.find((a: any) => a.uid === activeChat)?.firstName?.[0] || "A"}</div>}
                      <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${isMe ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white/10 rounded-tl-sm"}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input 
                    className="flex-1 bg-white/5 border-white/10" 
                    placeholder="Type your message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button type="submit" className="gap-2 shrink-0 px-6 bg-blue-600 hover:bg-blue-700">
                    Send <Send size={16} />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}