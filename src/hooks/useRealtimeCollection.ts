import { useState, useEffect } from "react";
import { Query, onSnapshot, DocumentData } from "firebase/firestore";

interface UseRealtimeCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * A generic hook to subscribe to a Firestore collection or query in real-time.
 */
export function useRealtimeCollection<T = DocumentData>(
  queryParam: Query | null | undefined
): UseRealtimeCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!queryParam) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      queryParam,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        
        setData(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useRealtimeCollection error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryParam]);

  return { data, loading, error };
}
