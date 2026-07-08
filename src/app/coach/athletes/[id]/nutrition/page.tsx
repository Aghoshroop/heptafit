"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2 } from "lucide-react";

export default function NutritionPage() {
  const params = useParams();
  const athleteId = params.id as string;
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!athleteId) return;
    
    // We store these as subcollections under the user document for simplicity
    const q = query(
      collection(db, "users", athleteId, "nutrition"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    await addDoc(collection(db, "users", athleteId, "nutrition"), {
      title: newItem,
      createdAt: serverTimestamp(),
      addedBy: "coach"
    });
    
    setNewItem("");
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "users", athleteId, "nutrition", id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nutrition</h2>
      
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input 
          placeholder="Add a new entry for Nutrition..." 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="bg-background/50 border-white/10"
        />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Add</Button>
      </form>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-background/30 border border-white/5 rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No records found for Nutrition.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-background/50 border border-white/5 p-4 rounded-xl flex justify-between items-center group">
              <div>
                <p className="font-medium">{item.title}</p>
                {item.createdAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.createdAt?.toDate?.() || Date.now()).toLocaleString()}
                  </p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
