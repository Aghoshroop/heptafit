"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ImageUpload";
import { Loader2, User, Activity, HeartPulse, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

type Tab = "personal" | "medical" | "body";

export default function EnterpriseStudentProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bodyLogs, setBodyLogs] = useState<any[]>([]);

  // Personal Info Form
  const { register: regPersonal, handleSubmit: handlePersonal, setValue: setPersonalValue, watch: watchPersonal, reset: resetPersonal } = useForm();
  // Medical Info Form
  const { register: regMed, handleSubmit: handleMed, reset: resetMed } = useForm();
  // Body Comp Form
  const { register: regBody, handleSubmit: handleBody, reset: resetBody } = useForm();

  const profileImage = watchPersonal("profileImage");

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        // Fetch Core Athlete Data
        const athleteSnap = await getDoc(doc(db, "athletes", user.uid));
        if (athleteSnap.exists()) {
          resetPersonal(athleteSnap.data());
        } else {
          // Initialize if empty
          await setDoc(doc(db, "athletes", user.uid), { email: user.email });
        }

        // Fetch Medical Record
        const medSnap = await getDoc(doc(db, "medical_records", user.uid));
        if (medSnap.exists()) {
          resetMed(medSnap.data());
        }

        // Fetch Body Comp Logs
        const q = query(collection(db, `athletes/${user.uid}/body_composition`), orderBy("date", "desc"));
        const unsub = onSnapshot(q, (snap) => {
          setBodyLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, resetPersonal, resetMed]);

  const onSavePersonal = async (data: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "athletes", user.uid), data);
      await updateDoc(doc(db, "users", user.uid), { firstName: data.firstName, lastName: data.lastName });
      toast.success("Personal information updated!");
    } catch (err) {
      toast.error("Failed to update personal info.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveMedical = async (data: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "medical_records", user.uid), data, { merge: true });
      toast.success("Medical records updated!");
    } catch (err) {
      toast.error("Failed to update medical records.");
    } finally {
      setIsSaving(false);
    }
  };

  const onLogBodyComp = async (data: any) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `athletes/${user.uid}/body_composition`), {
        ...data,
        date: new Date().toISOString(),
      });
      toast.success("Body composition logged!");
      resetBody();
    } catch (err) {
      toast.error("Failed to log body composition.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4">
        <Skeleton className="h-12 w-[300px]" />
        <Card glass className="p-6"><Skeleton className="h-[400px] w-full" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-foreground pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-1">Athlete Record</h1>
        <p className="text-muted-foreground">Manage your enterprise profile, medical history, and body metrics.</p>
      </div>

      <div className="flex space-x-2 border-b border-white/10 pb-px">
        {[
          { id: "personal", label: "Identity & Contact", icon: User },
          { id: "medical", label: "Medical Records", icon: HeartPulse },
          { id: "body", label: "Body Composition", icon: Activity }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`px-4 py-3 text-sm font-semibold rounded-t-xl transition-all relative flex items-center gap-2 ${
                isActive ? "text-primary bg-white/5" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {t.label}
              {isActive && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          
          {/* =======================
              PERSONAL INFO TAB
              ======================= */}
          {activeTab === "personal" && (
            <form onSubmit={handlePersonal(onSavePersonal)}>
              <Card glass className="bg-card/40 overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/5">
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Core identity and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  
                  {/* Section 1: Identity */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Identity</h3>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-2 block">Profile Photo</label>
                        <div className="border border-white/10 p-1 rounded-2xl bg-black/20">
                          <ImageUpload value={profileImage} onChange={(url) => setPersonalValue("profileImage", url, { shouldDirty: true })} onRemove={() => setPersonalValue("profileImage", null, { shouldDirty: true })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <div className="space-y-1"><label className="text-xs text-muted-foreground">First Name</label><Input className="glass" {...regPersonal("firstName")} /></div>
                        <div className="space-y-1"><label className="text-xs text-muted-foreground">Last Name</label><Input className="glass" {...regPersonal("lastName")} /></div>
                        <div className="space-y-1"><label className="text-xs text-muted-foreground">Preferred Name</label><Input className="glass" {...regPersonal("preferredName")} /></div>
                        <div className="space-y-1"><label className="text-xs text-muted-foreground">Gender</label><Input className="glass" {...regPersonal("gender")} /></div>
                        <div className="space-y-1"><label className="text-xs text-muted-foreground">Date of Birth</label><Input type="date" className="glass" {...regPersonal("dob")} /></div>
                        <div className="space-y-1"><label className="text-xs text-muted-foreground">Nationality</label><Input className="glass" {...regPersonal("nationality")} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Sport Info */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Sport & Federation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Sport</label><Input className="glass" {...regPersonal("sport")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Primary Event</label><Input className="glass" {...regPersonal("primaryEvent")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Secondary Event(s)</label><Input className="glass" {...regPersonal("secondaryEvent")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Federation ID</label><Input className="glass" {...regPersonal("federationId")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Academy ID</label><Input className="glass" {...regPersonal("academyId")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Passport Number</label><Input className="glass" {...regPersonal("passport")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Dominant Hand</label><Input className="glass" {...regPersonal("dominantHand")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Dominant Leg</label><Input className="glass" {...regPersonal("dominantLeg")} /></div>
                    </div>
                  </div>

                  {/* Section 3: Contact */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Contact & Emergency</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Email</label><Input disabled className="glass opacity-50" {...regPersonal("email")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Mobile</label><Input className="glass" {...regPersonal("mobile")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">WhatsApp</label><Input className="glass" {...regPersonal("whatsapp")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">City, Country</label><Input className="glass" {...regPersonal("location")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Emergency Contact Name</label><Input className="glass" {...regPersonal("emergencyName")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Emergency Phone</label><Input className="glass" {...regPersonal("emergencyPhone")} /></div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button type="submit" disabled={isSaving} className="shadow-[0_0_15px_var(--primary)]">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Identity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}

          {/* =======================
              MEDICAL TAB
              ======================= */}
          {activeTab === "medical" && (
            <form onSubmit={handleMed(onSaveMedical)}>
              <Card glass className="bg-card/40 overflow-hidden border-rose-500/20">
                <CardHeader className="border-b border-rose-500/20 bg-rose-500/5">
                  <CardTitle className="text-rose-500 flex items-center gap-2"><HeartPulse size={20}/> Medical Records</CardTitle>
                  <CardDescription>Highly sensitive data. Access restricted to authorized medical staff.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-xs text-muted-foreground">Blood Group</label><Input className="glass" {...regMed("bloodGroup")} /></div>
                    <div className="space-y-1"><label className="text-xs text-muted-foreground">Vision</label><Input className="glass" {...regMed("vision")} placeholder="e.g. 20/20" /></div>
                    <div className="space-y-1"><label className="text-xs text-muted-foreground">Hearing</label><Input className="glass" {...regMed("hearing")} /></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Allergies</label>
                      <textarea className="glass w-full rounded-xl p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" {...regMed("allergies")} placeholder="List all allergies..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Current Medications</label>
                      <textarea className="glass w-full rounded-xl p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" {...regMed("medications")} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Medical Conditions</label>
                      <textarea className="glass w-full rounded-xl p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" {...regMed("conditions")} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Previous Surgeries</label>
                      <textarea className="glass w-full rounded-xl p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" {...regMed("surgeries")} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <h3 className="text-sm font-bold text-rose-500 mb-2">Clearance Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs text-rose-500/70">ECG Clearance</label><Input className="bg-background/50 border-rose-500/20" {...regMed("ecgClearance")} placeholder="Date / Status" /></div>
                      <div className="space-y-1"><label className="text-xs text-rose-500/70">General Medical Clearance</label><Input className="bg-background/50 border-rose-500/20" {...regMed("medicalClearance")} placeholder="Status" /></div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button type="submit" disabled={isSaving} className="bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Medical Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}

          {/* =======================
              BODY COMPOSITION TAB
              ======================= */}
          {activeTab === "body" && (
            <div className="space-y-6">
              <Card glass className="bg-card/40 border-emerald-500/20">
                <CardHeader className="border-b border-emerald-500/20 bg-emerald-500/5">
                  <CardTitle className="text-emerald-500 flex items-center gap-2"><Activity size={20}/> Log Body Composition</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleBody(onLogBodyComp)} className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Weight (kg)</label><Input type="number" step="0.1" className="glass" {...regBody("weight")} required /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Body Fat %</label><Input type="number" step="0.1" className="glass" {...regBody("bodyFat")} required /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Muscle Mass (kg)</label><Input type="number" step="0.1" className="glass" {...regBody("muscleMass")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Bone Mass (kg)</label><Input type="number" step="0.1" className="glass" {...regBody("boneMass")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Waist (cm)</label><Input type="number" step="0.1" className="glass" {...regBody("waist")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Hip (cm)</label><Input type="number" step="0.1" className="glass" {...regBody("hip")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Chest (cm)</label><Input type="number" step="0.1" className="glass" {...regBody("chest")} /></div>
                      <div className="space-y-1"><label className="text-xs text-muted-foreground">Thigh (cm)</label><Input type="number" step="0.1" className="glass" {...regBody("thigh")} /></div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Log Metrics
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Historical Logs */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-4">Historical Logs</h3>
                <div className="space-y-3">
                  {bodyLogs.map((log) => (
                    <div key={log.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="font-bold">{format(new Date(log.date), "MMM dd, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">Logged at {format(new Date(log.date), "HH:mm")}</p>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="font-mono font-bold text-emerald-500">{log.weight} kg</p></div>
                        <div className="text-center"><p className="text-xs text-muted-foreground">Fat</p><p className="font-mono font-bold text-amber-500">{log.bodyFat}%</p></div>
                        <div className="text-center"><p className="text-xs text-muted-foreground">Muscle</p><p className="font-mono font-bold text-primary">{log.muscleMass || '-'} kg</p></div>
                      </div>
                    </div>
                  ))}
                  {bodyLogs.length === 0 && (
                    <div className="text-center p-8 glass rounded-2xl text-muted-foreground">No body composition logs yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
