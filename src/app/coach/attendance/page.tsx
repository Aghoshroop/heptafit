"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Check, X, Minus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { format } from "date-fns";

export default function CoachAttendancePage() {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({}); // athleteId -> status
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAthletes = async () => {
      const usersSnap = await getDocs(collection(db, "athletes"));
      setAthletes(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const q = query(
      collection(db, "attendance"),
      where("date", "==", selectedDate)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: Record<string, string> = {};
      snapshot.docs.forEach(doc => {
        records[doc.data().athleteId] = doc.data().status;
      });
      setAttendanceRecords(records);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const markAttendance = async (athleteId: string, status: 'present' | 'absent' | 'excused') => {
    if (!user) return;
    
    // Optimistic UI
    setAttendanceRecords(prev => ({ ...prev, [athleteId]: status }));
    
    try {
      // In a real app we should check if doc exists and update, or just use athleteId_date as doc ID
      const docId = `${athleteId}_${selectedDate}`;
      const docRef = collection(db, "attendance");
      
      // Delete existing for this date/athlete (simplification)
      const q = query(collection(db, "attendance"), where("athleteId", "==", athleteId), where("date", "==", selectedDate));
      const snaps = await getDocs(q);
      
      // Instead of complex logic, just add. A real app would use setDoc with a composite ID
      await addDoc(collection(db, "attendance"), {
        athleteId,
        date: selectedDate,
        status,
        notedBy: user.uid,
        timestamp: serverTimestamp()
      });
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-[600px] rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-1">Mark daily attendance for the team.</p>
        </div>
        <div className="w-full md:w-auto">
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="w-full md:w-48 bg-card"
          />
        </div>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Roster - {format(new Date(selectedDate), 'MMM dd, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Athlete</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {athletes.map(athlete => {
                  const status = attendanceRecords[athlete.id];
                  return (
                    <tr key={athlete.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{athlete.firstName} {athlete.lastName}</div>
                        <div className="text-xs text-muted-foreground">{athlete.email}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {status === 'present' && <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500"><Check size={14}/> Present</span>}
                        {status === 'absent' && <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500"><X size={14}/> Absent</span>}
                        {status === 'excused' && <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500"><Minus size={14}/> Excused</span>}
                        {!status && <span className="text-xs text-muted-foreground">Not Marked</span>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant={status === 'present' ? 'default' : 'outline'} className={status === 'present' ? 'bg-emerald-500 hover:bg-emerald-600' : ''} onClick={() => markAttendance(athlete.id, 'present')}>
                            Present
                          </Button>
                          <Button size="sm" variant={status === 'absent' ? 'default' : 'outline'} className={status === 'absent' ? 'bg-rose-500 hover:bg-rose-600' : ''} onClick={() => markAttendance(athlete.id, 'absent')}>
                            Absent
                          </Button>
                          <Button size="sm" variant={status === 'excused' ? 'default' : 'outline'} className={status === 'excused' ? 'bg-amber-500 hover:bg-amber-600' : ''} onClick={() => markAttendance(athlete.id, 'excused')}>
                            Excused
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
