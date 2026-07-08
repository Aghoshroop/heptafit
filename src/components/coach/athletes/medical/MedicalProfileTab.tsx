"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { medicalRepository } from "@/lib/repositories/medical.repository";
import { MedicalProfile } from "@/lib/types";
import { Plus, Trash2, HeartPulse, ShieldAlert, Phone, Save } from "lucide-react";

export function MedicalProfileTab({ athleteId }: { athleteId: string }) {
  const { userData } = useAuth();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [surgeries, setSurgeries] = useState<{ procedure: string; date: string }[]>([]);
  const [contacts, setContacts] = useState<{ name: string; relationship: string; phone: string }[]>([]);

  useEffect(() => {
    if (!athleteId) return;

    const q = query(collection(db, "medicalProfiles"), where("athleteId", "==", athleteId));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as MedicalProfile;
        data.id = snapshot.docs[0].id;
        setProfile(data);
        
        // Populate state
        setBloodGroup(data.bloodGroup || "");
        setAllergies(data.allergies || []);
        setChronicConditions(data.chronicConditions || []);
        setMedications(data.currentMedications || []);
        setSurgeries(data.previousSurgeries || []);
        setContacts(data.emergencyContacts || []);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [athleteId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        athleteId,
        bloodGroup,
        allergies,
        chronicConditions,
        currentMedications: medications,
        previousSurgeries: surgeries,
        emergencyContacts: contacts,
        organizationId: userData!.organizationId || "",
        headCoachId: userData!.accountType === "head_coach" ? userData!.uid : (userData!.organizationId || ""),
      } as any;

      if (profile?.id) {
        await medicalRepository.update(profile.id, payload, userData!.uid, `${userData!.firstName} ${userData!.lastName}`);
      } else {
        await medicalRepository.create(payload, userData!.uid, `${userData!.firstName} ${userData!.lastName}`);
      }
      toast.success("Medical profile saved");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addStringItem = (setter: any, list: string[], val: string) => {
    if (val.trim() && !list.includes(val)) setter([...list, val]);
  };

  const removeStringItem = (setter: any, list: string[], idx: number) => {
    const arr = [...list];
    arr.splice(idx, 1);
    setter(arr);
  };

  if (loading) return <div className="h-40 animate-pulse bg-white/5 rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-red-500 hover:bg-red-600 text-white">
          <Save size={16} className="mr-2" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic & Vitals */}
        <Card glass className="border-white/5 border-t-red-500/50 border-t-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HeartPulse size={18} className="text-red-400" />
              Basics & Blood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Blood Group</label>
              <select 
                value={bloodGroup} 
                onChange={e => setBloodGroup(e.target.value)} 
                className="w-full h-10 rounded-md border bg-background/50 px-3 text-sm border-white/10"
              >
                <option value="">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card glass className="border-white/5 border-t-red-500/50 border-t-4">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone size={18} className="text-red-400" />
                Emergency Contacts
              </CardTitle>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setContacts([...contacts, { name: "", relationship: "", phone: "" }])}>
                <Plus size={14} /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {contacts.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input placeholder="Name" value={c.name} onChange={e => { const arr = [...contacts]; arr[i].name = e.target.value; setContacts(arr); }} className="bg-background/50 h-8 text-xs" />
                <Input placeholder="Rel" value={c.relationship} onChange={e => { const arr = [...contacts]; arr[i].relationship = e.target.value; setContacts(arr); }} className="bg-background/50 h-8 text-xs w-20" />
                <Input placeholder="Phone" value={c.phone} onChange={e => { const arr = [...contacts]; arr[i].phone = e.target.value; setContacts(arr); }} className="bg-background/50 h-8 text-xs w-32" />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => { const arr = [...contacts]; arr.splice(i, 1); setContacts(arr); }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-xs text-muted-foreground">No emergency contacts added.</p>}
          </CardContent>
        </Card>

        {/* Allergies & Conditions */}
        <Card glass className="border-white/5 border-t-red-500/50 border-t-4 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-400" />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase">Allergies</label>
              <div className="flex gap-2">
                <Input id="newAllergy" placeholder="Add allergy..." className="h-8 text-xs bg-background/50" onKeyDown={e => { if(e.key === 'Enter'){ e.preventDefault(); addStringItem(setAllergies, allergies, e.currentTarget.value); e.currentTarget.value=''; } }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 text-xs rounded border border-red-500/20 flex items-center gap-1">
                    {a} <button type="button" onClick={() => removeStringItem(setAllergies, allergies, i)} className="hover:text-red-100">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase">Chronic Conditions</label>
              <div className="flex gap-2">
                <Input id="newCond" placeholder="Add condition (e.g., Asthma)..." className="h-8 text-xs bg-background/50" onKeyDown={e => { if(e.key === 'Enter'){ e.preventDefault(); addStringItem(setChronicConditions, chronicConditions, e.currentTarget.value); e.currentTarget.value=''; } }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {chronicConditions.map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded border border-amber-500/20 flex items-center gap-1">
                    {a} <button type="button" onClick={() => removeStringItem(setChronicConditions, chronicConditions, i)} className="hover:text-amber-100">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase">Current Medications</label>
              <div className="flex gap-2">
                <Input id="newMed" placeholder="Add medication..." className="h-8 text-xs bg-background/50" onKeyDown={e => { if(e.key === 'Enter'){ e.preventDefault(); addStringItem(setMedications, medications, e.currentTarget.value); e.currentTarget.value=''; } }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {medications.map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20 flex items-center gap-1">
                    {a} <button type="button" onClick={() => removeStringItem(setMedications, medications, i)} className="hover:text-blue-100">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-muted-foreground uppercase">Previous Surgeries</label>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-blue-400" onClick={() => setSurgeries([...surgeries, { procedure: "", date: "" }])}>
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>
              {surgeries.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="Procedure" value={s.procedure} onChange={e => { const arr = [...surgeries]; arr[i].procedure = e.target.value; setSurgeries(arr); }} className="bg-background/50 h-8 text-xs" />
                  <Input type="month" value={s.date} onChange={e => { const arr = [...surgeries]; arr[i].date = e.target.value; setSurgeries(arr); }} className="bg-background/50 h-8 text-xs w-32" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400 shrink-0" onClick={() => { const arr = [...surgeries]; arr.splice(i, 1); setSurgeries(arr); }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              {surgeries.length === 0 && <p className="text-xs text-muted-foreground">No prior surgeries reported.</p>}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
