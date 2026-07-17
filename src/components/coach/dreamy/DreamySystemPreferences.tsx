"use client";

import { useState, useEffect } from "react";
import { Monitor, Layout, Scale, Calendar, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function DreamySystemPreferences() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [prefs, setPrefs] = useState({
    darkMode: true,
    compactView: false,
    dataUnits: "Metric (kg, cm)",
    weekStart: "Monday",
    language: "English"
  });

  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(db, "users", user.uid)).then(snap => {
        if (snap.exists() && snap.data().preferences) {
          setPrefs({ ...prefs, ...snap.data().preferences });
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        preferences: prefs
      });
      // Optionally add a toast or visual feedback
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 border border-border flex flex-col h-full">
      <h3 className="text-sm font-semibold text-foreground mb-6">System Preferences</h3>
      
      <div className="mt-4 space-y-5">
        
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Monitor size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-foreground">Dark Mode</h4>
              <p className="text-[10px] text-muted-foreground">Use dark theme across the platform</p>
            </div>
          </div>
          <div 
            onClick={() => setPrefs(p => ({ ...p, darkMode: !p.darkMode }))}
            className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${prefs.darkMode ? 'bg-[#8B5CF6]' : 'bg-accent'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${prefs.darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Layout size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-foreground">Compact View</h4>
              <p className="text-[10px] text-muted-foreground">Show more content in less space</p>
            </div>
          </div>
          <div 
            onClick={() => setPrefs(p => ({ ...p, compactView: !p.compactView }))}
            className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${prefs.compactView ? 'bg-[#8B5CF6]' : 'bg-accent'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${prefs.compactView ? 'right-0.5' : 'left-0.5'}`}></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Scale size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-foreground">Data Units</h4>
              <p className="text-[10px] text-muted-foreground">Choose your preferred measurement units</p>
            </div>
          </div>
          <select 
            value={prefs.dataUnits}
            onChange={(e) => setPrefs(p => ({ ...p, dataUnits: e.target.value }))}
            className="bg-transparent text-xs text-muted-foreground border-none focus:outline-none cursor-pointer text-right appearance-none"
          >
            <option>Metric (kg, cm)</option>
            <option>Imperial (lbs, in)</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Calendar size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-foreground">Week Start Day</h4>
              <p className="text-[10px] text-muted-foreground">Choose the first day of the week</p>
            </div>
          </div>
          <select 
            value={prefs.weekStart}
            onChange={(e) => setPrefs(p => ({ ...p, weekStart: e.target.value }))}
            className="bg-transparent text-xs text-muted-foreground border-none focus:outline-none cursor-pointer text-right appearance-none"
          >
            <option>Monday</option>
            <option>Sunday</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Globe size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-foreground">Language</h4>
              <p className="text-[10px] text-muted-foreground">Select your preferred language</p>
            </div>
          </div>
          <select 
            value={prefs.language}
            onChange={(e) => setPrefs(p => ({ ...p, language: e.target.value }))}
            className="bg-transparent text-xs text-muted-foreground border-none focus:outline-none cursor-pointer text-right appearance-none"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-foreground rounded-lg py-2 text-xs font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}
