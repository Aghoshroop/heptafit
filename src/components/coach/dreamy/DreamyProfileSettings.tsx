"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Camera, Edit2, Loader2 } from "lucide-react";

export function DreamyProfileSettings() {
  const { userData, user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    role: "Head Coach"
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email || user?.email || "",
        phone: (userData as any).phone || "",
        location: (userData as any).location || "",
        role: (userData as any).role === "coach" ? "Head Coach" : "Assistant Coach"
      });
    }
  }, [userData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        console.warn("No ImgBB API key found. Please set NEXT_PUBLIC_IMGBB_API_KEY in your .env.local file.");
        alert("Image upload requires a configured API key.");
        setUploadingImage(false);
        return;
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.url;
        await updateDoc(doc(db, "users", user.uid), {
          photoURL: imageUrl
        });
        setSuccessMessage("Profile photo updated!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const parts = formData.fullName.split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");

      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phone: formData.phone,
        location: formData.location
        // We typically don't update email or role blindly in Firestore here unless admin, but keeping it in form
      });
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#11141A] rounded-xl p-5 border border-[#1F2937] flex h-full">
      
      {/* Left side: Avatar */}
      <div className="w-[200px] shrink-0 border-r border-[#1F2937] pr-5 flex flex-col items-center">
        <h3 className="text-sm font-semibold text-white self-start mb-6">Profile Information</h3>
        
        <div className="relative mb-4">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
          />
          <img 
            src={userData?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || "Coach")}&background=1F2937&color=fff&size=128`} 
            className="w-24 h-24 rounded-full border-2 border-[#1F2937] object-cover" 
            alt="Profile"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="absolute bottom-0 right-0 w-8 h-8 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center border-2 border-[#11141A] hover:bg-[#7C3AED] transition-colors disabled:opacity-50"
          >
            {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          </button>
        </div>

        <h4 className="text-sm font-semibold text-white text-center">{formData.fullName || "Coach"}</h4>
        <span className="text-[10px] font-medium text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded mt-1">{formData.role}</span>
        <p className="text-[10px] text-[#9CA3AF] mt-3 text-center truncate w-full">{formData.email}</p>
        <p className="text-[10px] text-[#9CA3AF] mt-1 text-center truncate w-full">{formData.phone || "No phone added"}</p>
        <p className="text-[10px] text-[#9CA3AF] mt-1 text-center truncate w-full">{formData.location || "No location added"}</p>

        <button className="mt-6 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors text-xs font-medium">
          <Edit2 size={12} /> Edit Profile
        </button>
      </div>

      {/* Right side: Form Fields */}
      <div className="flex-1 pl-5 flex flex-col">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#374151] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              disabled
              className="w-full bg-[#1F2937]/30 border border-[#374151] rounded-lg px-3 py-2 text-xs text-[#9CA3AF] cursor-not-allowed focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#374151] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#374151] rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-medium text-[#9CA3AF] mb-1.5">Role</label>
            <select 
              name="role"
              value={formData.role}
              disabled
              className="w-full bg-[#1F2937]/30 border border-[#374151] rounded-lg px-3 py-2 text-xs text-[#9CA3AF] appearance-none cursor-not-allowed focus:outline-none"
            >
              <option>Head Coach</option>
              <option>Assistant Coach</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[#34D399]">{successMessage}</span>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-lg px-6 py-2 text-xs font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
