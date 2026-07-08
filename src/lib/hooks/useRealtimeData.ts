import { useState, useEffect } from "react";
import { collection, query, onSnapshot, QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useRealtimeData<T>(collectionName: string, queryConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Stringifying constraints isn't ideal but it works as a dependency if constraints are created on each render
    const constraintsString = JSON.stringify(queryConstraints);
    
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
      (err) => {
        console.error(`Error fetching realtime data for ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]); // Removed JSON.stringify(queryConstraints) to avoid infinite loops if it changes every render unnecessarily

  return { data, loading, error };
}
