import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export interface Message {
  id?: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: any;
  isRead: boolean;
  type: "text" | "announcement" | "system";
}

export interface ChatRoom {
  id?: string;
  type: "direct" | "group" | "organization_announcement";
  participants: string[];
  organizationId: string;
  lastMessage?: string;
  lastMessageAt?: any;
  createdAt: any;
}

/**
 * Creates or retrieves an existing 1-on-1 chat room between two users.
 */
export async function getOrCreateDirectChat(organizationId: string, userA: string, userB: string): Promise<string> {
  const roomsRef = collection(db, "chatRooms");
  
  // Find existing room
  const q = query(
    roomsRef, 
    where("type", "==", "direct"), 
    where("organizationId", "==", organizationId),
    where("participants", "array-contains", userA)
  );
  
  const snapshot = await getDocs(q);
  const existingRoom = snapshot.docs.find(d => d.data().participants.includes(userB));
  
  if (existingRoom) {
    return existingRoom.id;
  }

  // Create new room
  const newRoomRef = await addDoc(roomsRef, {
    type: "direct",
    organizationId,
    participants: [userA, userB],
    createdAt: serverTimestamp()
  });

  return newRoomRef.id;
}

/**
 * Sends a message to a specific chat room.
 */
export async function sendMessage(chatRoomId: string, senderId: string, senderName: string, content: string, type: Message["type"] = "text") {
  const messagesRef = collection(db, "messages");
  
  await addDoc(messagesRef, {
    chatRoomId,
    senderId,
    senderName,
    content,
    type,
    isRead: false,
    createdAt: serverTimestamp()
  });

  // Update room's last message
  const roomRef = doc(db, "chatRooms", chatRoomId);
  await updateDoc(roomRef, {
    lastMessage: content,
    lastMessageAt: serverTimestamp()
  });
}

/**
 * Subscribes to messages in a chat room. Real-time hook.
 */
export function subscribeToMessages(chatRoomId: string, callback: (messages: Message[]) => void) {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("chatRoomId", "==", chatRoomId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
}
