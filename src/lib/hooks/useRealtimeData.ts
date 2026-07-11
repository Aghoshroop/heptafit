import { useState, useEffect } from "react";
import { collection, query, onSnapshot, QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export function useRealtimeData<T>(collectionName: string, queryConstraints: QueryConstraint[] = [], enabled: boolean = true) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stringifying constraints isn't ideal but it works as a dependency if constraints are created on each render
  const constraintsString = JSON.stringify(queryConstraints);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(results);
        setLoading(false);
      },
      (err: any) => {
        console.error(`Error fetching realtime data for ${collectionName}:`, err);
        setError(err);
        setLoading(false);
        if (err.code === 'permission-denied') {
          // toast.error(`Permission denied accessing ${collectionName}.`);
        } else {
          toast.error(`Failed to sync ${collectionName} data.`);
        }
      }
    );

    return () => unsubscribe();
  }, [collectionName, constraintsString, enabled]);

  return { data, loading, error };
}
