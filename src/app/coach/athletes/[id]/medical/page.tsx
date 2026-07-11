"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2 } from "lucide-react";

export default function MedicalPage() {
  const params = useParams();
  const athleteId = params.id as string;
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!athleteId) return;
    
    // We store these as subcollections under the user document for simplicity
    const q = query(
      collection(db, "users", athleteId, "medical"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId]);



  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medical</h2>
      


      {/* Current Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-2">Current Restrictions</h3>
          <p className="text-sm text-foreground/80 font-medium">None</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Return-to-Play</h3>
          <p className="text-sm text-foreground/80 font-medium">Cleared for all activities</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Medication Alerts</h3>
          <p className="text-sm text-foreground/80 font-medium">No active medications</p>
        </div>
      </div>

      {/* Medical History - Collapsed */}
      <details className="group border border-white/10 rounded-2xl bg-black/20 overflow-hidden open:bg-black/40 transition-colors mt-6">
        <summary className="px-6 py-4 flex items-center gap-2 cursor-pointer outline-none">
          <h3 className="font-bold text-lg flex-1">Medical History</h3>
          <div className="text-muted-foreground group-open:rotate-180 transition-transform">▼</div>
        </summary>
        <div className="px-6 pb-6 pt-2 border-t border-white/5">
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
              <p className="text-muted-foreground">No historical records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-background/50 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.createdAt?.toDate?.() || Date.now()).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
