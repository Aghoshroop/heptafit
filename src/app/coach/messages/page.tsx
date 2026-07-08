"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeData } from "@/lib/hooks/useRealtimeData";
import { where } from "firebase/firestore";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare, Send, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function MessagesPage() {
  const { userData } = useAuth();
  const orgId = userData?.organizationId || "";
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const { data: users, loading } = useRealtimeData("users", [
    where("organizationId", "==", orgId)
  ]);
  
  const athletes: any[] = users.filter((u: any) => u.accountType === "athlete");

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
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {athlete.firstName?.[0] || ""}{athlete.lastName?.[0] || ""}
                </div>
                <div>
                  <p className="font-semibold">{athlete.firstName} {athlete.lastName}</p>
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
                description="Select an athlete to start a conversation or send an announcement."
                className="border-none bg-transparent"
              />
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {athletes.find((a: any) => a.uid === activeChat)?.firstName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold">{athletes.find((a: any) => a.uid === activeChat)?.firstName} {athletes.find((a: any) => a.uid === activeChat)?.lastName}</h3>
                    <p className="text-xs text-emerald-500">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex justify-center">
                  <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full">Today</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm">
                    Hey Coach, I'm feeling a bit tight in my left hamstring after yesterday's session. Should I modify today's sprint block?
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex gap-2">
                  <Input className="flex-1 bg-white/5 border-white/10" placeholder="Type your message..." />
                  <Button className="gap-2 shrink-0 px-6">
                    Send <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}