"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { User, Phone, Trophy, Activity, Camera, Hash, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activityService";
import { QRCodeSVG } from "qrcode.react";

const personalSchema = z.object({
  // Identity
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  athleteNumber: z.string().optional(),
  permanentId: z.string().optional(),
  passportNumber: z.string().optional(),
  nationalId: z.string().optional(),
  
  // Sports Profile
  sport: z.string().optional(),
  primaryEvent: z.string().optional(),
  secondaryEvents: z.string().optional(),
  coachName: z.string().optional(),
  academy: z.string().optional(),
  trainingGroup: z.string().optional(),
  yearsInSport: z.string().optional(),
  competitionCategory: z.string().optional(),
  federationId: z.string().optional(),
  status: z.string().optional(),
  competitionPhase: z.string().optional(),
  
  // Contacts & Demographics
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  parentGuardianName: z.string().optional(),
  parentGuardianPhone: z.string().optional(),
  languages: z.string().optional(),
  bloodGroup: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export default function PersonalPage() {
  const params = useParams();
  const athleteId = params.id as string;
  const { userData } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // User state that is not in the main form
  const [inviteCode, setInviteCode] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: "", lastName: "", dob: "", gender: "", nationality: "",
      athleteNumber: "", permanentId: "", passportNumber: "", nationalId: "", federationId: "",
      sport: "", primaryEvent: "", secondaryEvents: "",
      coachName: "", academy: "", trainingGroup: "", yearsInSport: "", competitionCategory: "",
      status: "Active", competitionPhase: "Off Season",
      phone: "", email: "", emergencyContactName: "", emergencyContactPhone: "", parentGuardianName: "", parentGuardianPhone: "",
      languages: "", bloodGroup: "",
    }
  });

  useEffect(() => {
    if (!athleteId) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", athleteId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        setInviteCode(data.inviteCode || "");
        setProfilePhotoUrl(data.profilePhotoUrl || "");
        
        form.reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          dob: data.dob || "",
          gender: data.gender || "",
          nationality: data.nationality || "",
          athleteNumber: data.athleteNumber || "",
          permanentId: data.permanentId || "",
          passportNumber: data.passportNumber || "",
          nationalId: data.nationalId || "",
          
          sport: data.sport || "",
          primaryEvent: data.primaryEvent || "",
          secondaryEvents: Array.isArray(data.secondaryEvents) ? data.secondaryEvents.join(", ") : (data.secondaryEvents || ""),
          coachName: data.coachName || "",
          academy: data.academy || "",
          trainingGroup: data.trainingGroup || "",
          yearsInSport: data.yearsInSport?.toString() || "",
          competitionCategory: data.competitionCategory || "",
          federationId: data.federationId || "",
          
          status: data.status || "Active",
          competitionPhase: data.competitionPhase || "Off Season",
          
          phone: data.phone || "",
          email: data.email || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
          parentGuardianName: data.parentGuardianName || "",
          parentGuardianPhone: data.parentGuardianPhone || "",
          languages: Array.isArray(data.languages) ? data.languages.join(", ") : (data.languages || ""),
          bloodGroup: data.bloodGroup || "",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [athleteId, form]);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Invite code copied to clipboard");
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Using ImgBB API
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error("ImgBB API key is not configured in .env.local");

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const url = data.data.url;
        await updateDoc(doc(db, "users", athleteId), {
          profilePhotoUrl: url
        });
        setProfilePhotoUrl(url);
        toast.success("Profile photo updated");
        
        await logActivity({
          actorId: userData?.uid || "unknown",
          actorName: userData?.firstName ? `${userData.firstName} ${userData.lastName}` : "Coach",
          actorRole: userData?.accountType === "support_staff" ? "Support Staff" : "Head Coach",
          athleteId,
          module: "profile",
          action: "updated",
          title: "Profile Photo Updated",
          metadata: { action: "Image upload via ImgBB" }
        });
      } else {
        throw new Error("Failed to upload image to ImgBB");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onSubmit = async (data: PersonalFormValues) => {
    setSaving(true);
    try {
      const processedData = {
        ...data,
        secondaryEvents: data.secondaryEvents ? data.secondaryEvents.split(",").map((s: string) => s.trim()) : [],
        languages: data.languages ? data.languages.split(",").map((s: string) => s.trim()) : [],
        updatedAt: new Date(),
        updatedBy: userData?.uid || "unknown"
      };
      
      await updateDoc(doc(db, "users", athleteId), processedData);
      
      await logActivity({
        actorId: userData?.uid || "unknown",
        actorName: userData?.firstName ? `${userData.firstName} ${userData.lastName}` : "Coach",
        actorRole: userData?.accountType === "support_staff" ? "Support Staff" : "Head Coach",
        athleteId,
        module: "profile",
        action: "updated",
        title: "Profile Information Updated",
        description: `Updated profile details for ${data.firstName} ${data.lastName}`,
        metadata: {
          status: data.status,
          phase: data.competitionPhase
        }
      });
      
      toast.success("Personal information updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <p className="text-muted-foreground">Manage athlete identity, physical baseline, and contact details.</p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 px-8 rounded-xl">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar: Photo & QR Code */}
        <div className="space-y-6">
          <Card glass className="border-white/5 overflow-hidden flex flex-col items-center p-6 text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-muted-foreground opacity-50" />
                )}
              </div>
              <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                <Camera size={24} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              </label>
            </div>
            {uploadingPhoto && <p className="text-xs text-blue-400 mb-2 animate-pulse">Uploading...</p>}
            
            <h3 className="font-bold text-xl">{form.watch("firstName")} {form.watch("lastName")}</h3>
            <p className="text-muted-foreground text-sm mb-4">{form.watch("sport")} • {form.watch("primaryEvent")}</p>
            
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-3">Athlete Passport QR</p>
              <div className="bg-white p-2 rounded-lg mb-3">
                <QRCodeSVG value={`athlete:${athleteId}`} size={120} />
              </div>
              
              {inviteCode && (
                <div className="w-full mt-2">
                  <p className="text-[10px] uppercase text-muted-foreground mb-1 text-left">Invite Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 py-1.5 px-3 rounded text-sm tracking-wider font-mono text-blue-400 border border-white/10">
                      {inviteCode}
                    </code>
                    <Button variant="outline" size="icon" onClick={handleCopyInvite} className="h-8 w-8 border-white/10 shrink-0">
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card glass className="border-white/5 overflow-hidden">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <h3 className="font-bold text-sm">Status & Phase</h3>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Current Status</label>
                <select {...form.register("status")} className="w-full h-9 rounded-md border bg-background/50 px-3 text-sm border-white/10 focus:ring-1 focus:ring-blue-500 font-bold">
                  <option value="Active" className="text-emerald-500">Active</option>
                  <option value="Injured" className="text-red-500">Injured</option>
                  <option value="Rehabilitation" className="text-amber-500">Rehabilitation</option>
                  <option value="Inactive" className="text-slate-500">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Competition Phase</label>
                <select {...form.register("competitionPhase")} className="w-full h-9 rounded-md border bg-background/50 px-3 text-sm border-white/10 focus:ring-1 focus:ring-blue-500">
                  <option value="Off Season">Off Season</option>
                  <option value="Pre Season">Pre Season</option>
                  <option value="In Season">In Season</option>
                  <option value="Taper">Taper (Peaking)</option>
                  <option value="Transition">Transition</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content: The Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Identity & Demographics */}
            <Card glass className="border-white/5 overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Hash size={18} className="text-blue-400" />
                <h3 className="font-bold text-lg">Identity & Official IDs</h3>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">First Name *</label>
                  <Input {...form.register("firstName")} className="bg-background/50 border-white/10 h-9" />
                  {form.formState.errors.firstName && <p className="text-[10px] text-red-500">{form.formState.errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Last Name *</label>
                  <Input {...form.register("lastName")} className="bg-background/50 border-white/10 h-9" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Date of Birth</label>
                  <Input type="date" {...form.register("dob")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Gender</label>
                    <select {...form.register("gender")} className="w-full h-9 rounded-md border bg-background/50 px-2 text-sm border-white/10">
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Nationality</label>
                    <Input {...form.register("nationality")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-white/5 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Athlete Number</label>
                    <Input {...form.register("athleteNumber")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Permanent ID</label>
                    <Input {...form.register("permanentId")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Passport Number (Optional)</label>
                    <Input {...form.register("passportNumber")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">National ID (Optional)</label>
                    <Input {...form.register("nationalId")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-white/5 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Blood Group</label>
                    <Input {...form.register("bloodGroup")} placeholder="e.g. O+, A-" className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Languages (Comma separated)</label>
                    <Input {...form.register("languages")} placeholder="e.g. English, Spanish" className="bg-background/50 border-white/10 h-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sports Profile */}
            <Card glass className="border-white/5 overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                <h3 className="font-bold text-lg">Sports Profile</h3>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Sport</label>
                  <Input {...form.register("sport")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Years in Sport</label>
                    <Input type="number" {...form.register("yearsInSport")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Input {...form.register("competitionCategory")} placeholder="e.g. U21, Elite" className="bg-background/50 border-white/10 h-9" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Federation ID</label>
                  <Input {...form.register("federationId")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1"></div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Dominant Event</label>
                  <Input {...form.register("primaryEvent")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Secondary Events</label>
                  <Input {...form.register("secondaryEvents")} className="bg-background/50 border-white/10 h-9" />
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4 pt-2 border-t border-white/5 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Coach</label>
                    <Input {...form.register("coachName")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Academy/Club</label>
                    <Input {...form.register("academy")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Training Group</label>
                    <Input {...form.register("trainingGroup")} className="bg-background/50 border-white/10 h-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card glass className="border-white/5 overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Phone size={18} className="text-indigo-400" />
                <h3 className="font-bold text-lg">Contact Information</h3>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <Input {...form.register("phone")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <Input {...form.register("email")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1 md:col-span-2 pt-2 border-t border-white/5 mt-2">
                  <label className="text-sm font-bold text-foreground">Emergency Contact</label>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <Input {...form.register("emergencyContactName")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <Input {...form.register("emergencyContactPhone")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1 md:col-span-2 pt-2 border-t border-white/5 mt-2">
                  <label className="text-sm font-bold text-foreground">Parent / Guardian</label>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <Input {...form.register("parentGuardianName")} className="bg-background/50 border-white/10 h-9" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <Input {...form.register("parentGuardianPhone")} className="bg-background/50 border-white/10 h-9" />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
