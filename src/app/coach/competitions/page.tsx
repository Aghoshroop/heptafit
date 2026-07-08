"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Trophy, Calendar as CalendarIcon, MapPin, Users, Plus, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");

  useEffect(() => {
    const q = query(collection(db, "competitions"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompetitions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !venue) return;

    try {
      await addDoc(collection(db, "competitions"), {
        name,
        date,
        venue,
        organizer,
        events: [],
        entries: [],
        createdAt: serverTimestamp()
      });
      toast.success("Competition added");
      setName("");
      setDate("");
      setVenue("");
      setOrganizer("");
      setIsAdding(false);
    } catch (err) {
      toast.error("Failed to add competition");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this competition?")) return;
    try {
      await deleteDoc(doc(db, "competitions", id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Skeleton className="w-full h-[600px] rounded-xl" />;

  const upcomingComps = competitions.filter(c => new Date(c.date) >= new Date(new Date().setHours(0,0,0,0)));
  const pastComps = competitions.filter(c => new Date(c.date) < new Date(new Date().setHours(0,0,0,0)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
          <p className="text-muted-foreground mt-1">Manage event calendar, entries, and travel logistics.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : <><Plus size={16} className="mr-2" /> Add Event</>}
        </Button>
      </div>

      {isAdding && (
        <Card glass className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Add New Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. National Championships" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Olympic Stadium" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organizer / Host</label>
                  <Input value={organizer} onChange={e => setOrganizer(e.target.value)} placeholder="e.g. Athletics Federation" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Save Event</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2"><Clock size={18} className="text-primary"/> Upcoming</h3>
        {upcomingComps.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground">No upcoming competitions.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingComps.map(comp => {
              const daysAway = differenceInDays(new Date(comp.date), new Date());
              return (
                <Card key={comp.id} glass className="relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full ${daysAway <= 7 ? 'bg-rose-500' : 'bg-primary'}`} />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1" title={comp.name}>{comp.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarIcon size={14} /> {format(new Date(comp.date), "PPP")}
                        </p>
                      </div>
                      <div className="text-center px-3 py-1 bg-muted rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">T-Minus</p>
                        <p className={`font-bold text-lg ${daysAway <= 7 ? 'text-rose-500' : 'text-primary'}`}>{daysAway}d</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><MapPin size={16} /> {comp.venue}</div>
                      <div className="flex items-center gap-2"><Trophy size={16} /> {comp.organizer || "N/A"}</div>
                      <div className="flex items-center gap-2"><Users size={16} /> {comp.entries?.length || 0} Entries</div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Button variant="outline" className="flex-1">Manage</Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(comp.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {pastComps.length > 0 && (
        <div className="space-y-4 pt-8">
          <h3 className="font-semibold text-lg text-muted-foreground">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastComps.map(comp => (
              <Card key={comp.id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{comp.name}</h4>
                    <p className="text-xs text-muted-foreground">{format(new Date(comp.date), "PPP")}</p>
                  </div>
                  <Button variant="ghost" size="sm">Results</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
