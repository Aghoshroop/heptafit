import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ScheduleSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleSessionDialog({ isOpen, onClose }: ScheduleSessionDialogProps) {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    eventType: "Training",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.organizationId) return;
    
    setLoading(true);
    try {
      // Create ISO string for start
      const startIso = new Date(`${formData.date}T${formData.time}`).toISOString();
      const endIso = new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString(); // 1 hr later

      await addDoc(collection(db, "calendarEvents"), {
        organizationId: userData.organizationId,
        title: formData.title,
        start: startIso,
        end: endIso,
        eventType: formData.eventType,
        description: formData.description,
        createdBy: userData.uid,
        participants: [], // Can be filled later
        createdAt: serverTimestamp(),
      });

      toast.success("Session scheduled!");
      setFormData({ title: "", date: "", time: "", eventType: "Training", description: "" });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Session">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Session Title</label>
          <Input 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. Morning Track Workout" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Date</label>
            <Input 
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Time</label>
            <Input 
              required
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Event Type</label>
            <select 
              className="w-full bg-background border border-white/10 rounded-md p-2 text-sm text-foreground focus:outline-none focus:border-accent"
              value={formData.eventType}
              onChange={(e) => setFormData({...formData, eventType: e.target.value})}
            >
              <option value="Training">Training</option>
              <option value="Match">Match</option>
              <option value="Medical">Medical</option>
              <option value="Recovery">Recovery</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Notes (Optional)</label>
          <textarea 
            className="w-full bg-background border border-white/10 rounded-md p-2 text-sm text-foreground min-h-[80px] focus:outline-none focus:border-accent"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Any specific focus for this session?"
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-foreground">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
