





"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Bell, CheckCircle2, ShieldAlert, HeartPulse, Dumbbell, Activity, Info } from "lucide-react";
import { notificationRepository } from "@/lib/repositories/notification.repository";
import { Notification } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";

export function NotificationInbox() {
  const { userData } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userData?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", userData.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(docs);
      setUnreadCount(docs.filter(d => !d.isRead).length);
    });

    return () => unsub();
  }, [userData]);

  const markAsRead = async (id: string) => {
    if (!userData) return;
    await notificationRepository.update(id, { isRead: true }, userData.uid, "System");
  };

  const markAllRead = async () => {
    if (!userData) return;
    await notificationRepository.markAllAsRead(userData.uid);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Wellness': return <HeartPulse size={16} className="text-red-400" />;
      case 'Performance': return <Activity size={16} className="text-amber-400" />;
      case 'Injury': return <ShieldAlert size={16} className="text-orange-500" />;
      case 'Training': return <Dumbbell size={16} className="text-blue-400" />;
      default: return <Info size={16} className="text-slate-400" />;
    }
  };

  const groupedUnread = notifications
    .filter(n => !n.isRead)
    .reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell size={20} className="text-muted-foreground hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="flex justify-between items-center p-3 border-b border-white/10">
          <h4 className="font-bold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              You're all caught up!
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Grouped Unread Summary */}
              {Object.keys(groupedUnread).length > 0 && (
                <div className="p-3 bg-blue-500/5 border-b border-blue-500/20">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Unread Summary</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(groupedUnread).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-2 bg-black/40 rounded px-2 py-1 border border-white/5">
                        {getIcon(type)}
                        <span className="text-xs text-white">{count} {type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual Notifications */}
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-white/5 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors ${!notification.isRead ? 'bg-white/5' : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id!)}
                >
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm truncate pr-2 ${!notification.isRead ? 'font-bold text-white' : 'font-medium text-white/80'}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {notification.createdAt?.toDate?.().toLocaleDateString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
