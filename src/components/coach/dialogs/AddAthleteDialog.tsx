import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, serverTimestamp, doc, writeBatch } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddAthleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAthleteDialog({ isOpen, onClose }: AddAthleteDialogProps) {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sport: "",
    event: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.organizationId || !user?.uid) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      const userRef = doc(collection(db, "users"));
      batch.set(userRef, {
        accountType: "athlete",
        role: "student",
        organizationId: userData.organizationId,
        headCoachId: userData.accountType === "head_coach" ? user.uid : userData.organizationId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        sport: formData.sport,
        event: formData.event,
        athleteId: userRef.id,
        createdAt: serverTimestamp(),
      });
      
      const relRef = doc(collection(db, "coachAthleteRelationships"));
      batch.set(relRef, {
        coachId: user.uid,
        studentId: userRef.id,
        status: "active",
        createdAt: serverTimestamp()
      });

      await batch.commit();

      toast.success("Athlete added successfully!");
      setFormData({ firstName: "", lastName: "", email: "", sport: "", event: "" });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add athlete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Athlete">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">First Name</label>
            <Input 
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="John" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Last Name</label>
            <Input 
              required
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Doe" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground">Email Address</label>
          <Input 
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="athlete@example.com" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Sport</label>
            <Input 
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
              placeholder="e.g. Athletics" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Event</label>
            <Input 
              value={formData.event}
              onChange={(e) => setFormData({...formData, event: e.target.value})}
              placeholder="e.g. 100m Sprint" 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Athlete
          </Button>
        </div>
      </form>
    </Modal>
  );
}
