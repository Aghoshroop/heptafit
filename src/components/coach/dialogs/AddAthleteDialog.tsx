import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, serverTimestamp, doc, writeBatch } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ATHLETICS_METADATA } from "@/lib/intelligence/sportMetadata";

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
    sport: "Athletics",
    discipline: "Track & Field",
    category: "",
    primaryEvent: "",
    gender: "Men",
    ageGroup: "Senior"
  });

  const categories = useMemo(() => {
    const discipline = ATHLETICS_METADATA.disciplines.find(d => d.name === formData.discipline);
    return discipline?.categories || [];
  }, [formData.discipline]);

  const events = useMemo(() => {
    const category = categories.find(c => c.id === formData.category);
    return category?.events || [];
  }, [categories, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.organizationId || !user?.uid) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      const selectedEventObj = events.find(e => e.id === formData.primaryEvent);
      const performanceProfile = selectedEventObj?.performanceProfile || "General";
      
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
        discipline: formData.discipline,
        category: formData.category,
        primaryEvent: formData.primaryEvent,
        performanceProfile,
        gender: formData.gender,
        ageGroup: formData.ageGroup,
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
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        sport: "Athletics",
        discipline: "Track & Field",
        category: "",
        primaryEvent: "",
        gender: "Men",
        ageGroup: "Senior"
      });
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
        {/* Personal Details */}
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

        {/* Classification */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Gender</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-primary/50 text-white"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
            >
              <option value="Men" className="bg-zinc-900">Men</option>
              <option value="Women" className="bg-zinc-900">Women</option>
              <option value="Mixed" className="bg-zinc-900">Mixed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Age Group</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-primary/50 text-white"
              value={formData.ageGroup}
              onChange={(e) => setFormData({...formData, ageGroup: e.target.value as any})}
            >
              <option value="U18" className="bg-zinc-900">U18</option>
              <option value="U20" className="bg-zinc-900">U20</option>
              <option value="Senior" className="bg-zinc-900">Senior</option>
              <option value="Masters" className="bg-zinc-900">Masters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Category</label>
            <select 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-primary/50 text-white"
              value={formData.category}
              onChange={(e) => {
                setFormData({...formData, category: e.target.value, primaryEvent: ""});
              }}
            >
              <option value="" disabled className="bg-zinc-900">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Primary Event</label>
            <select 
              required
              disabled={!formData.category}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-primary/50 text-white disabled:opacity-50"
              value={formData.primaryEvent}
              onChange={(e) => setFormData({...formData, primaryEvent: e.target.value})}
            >
              <option value="" disabled className="bg-zinc-900">Select Event</option>
              {events.map(e => (
                <option key={e.id} value={e.id} className="bg-zinc-900">{e.name}</option>
              ))}
            </select>
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
