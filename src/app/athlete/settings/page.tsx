"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Bell, Lock, User, Palette } from "lucide-react";
import { toast } from "sonner";

export default function StudentSettingsPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings updated successfully");
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-accent/50 text-foreground font-medium">
            <User size={18} className="mr-3" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Bell size={18} className="mr-3" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Lock size={18} className="mr-3" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Palette size={18} className="mr-3" /> Appearance
          </Button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <Card glass>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Update your personal information. Medical and athletic data is managed in your Profile page.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input defaultValue={userData?.firstName || ""} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input defaultValue={userData?.lastName || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue={userData?.email || ""} disabled />
                  <p className="text-xs text-muted-foreground">Contact your coach to change your email address.</p>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card glass>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive hover:text-white">
                Request Account Deletion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
