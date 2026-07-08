"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Shield, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

export function JoinClient({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [code, setCode] = useState(initialCode);
  const [step, setStep] = useState<"enter_code" | "validating" | "details" | "processing" | "success" | "error">("enter_code");
  const [inviteDetails, setInviteDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Registration state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (initialCode) {
      handleValidateCode(initialCode);
    }
  }, [initialCode]);

  const handleValidateCode = async (codeToValidate: string) => {
    if (!codeToValidate.trim()) {
      setErrorMessage("Please enter an invitation code.");
      return;
    }
    
    setStep("validating");
    setErrorMessage("");

    try {
      const res = await fetch("/api/invitations/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToValidate }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to validate invitation.");
      }

      setInviteDetails(data);
      setStep("details");
    } catch (err: any) {
      setErrorMessage(err.message);
      setStep("error");
    }
  };

  const handleAccept = async (userId: string) => {
    setStep("processing");
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to accept invitation.");
      }

      setStep("success");
      setTimeout(() => {
        router.push("/athlete"); // Assuming athletes go to /athlete
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message);
      setStep("error");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setErrorMessage("");

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUserId = userCredential.user.uid;

      // 2. Create User Profile
      await setDoc(doc(db, "users", newUserId), {
        firstName,
        lastName,
        email: email.toLowerCase(),
        accountType: inviteDetails.role || "athlete",
        createdAt: new Date().toISOString(),
      });

      // 3. Accept Invitation via Backend
      await handleAccept(newUserId);
      
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      setStep("details");
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col items-center justify-center p-4">
      {/* Background styling */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Join Heptafit</h1>
          <p className="text-muted-foreground mt-2">Connect with your coach and team.</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "enter_code" && (
            <motion.div key="enter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="bg-card/50 border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleValidateCode(code); }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Invitation Code</label>
                      <Input 
                        placeholder="e.g. A1B2C3" 
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="bg-background/50 border-white/10 font-mono text-center tracking-widest uppercase text-lg"
                        maxLength={8}
                      />
                    </div>
                    {errorMessage && <p className="text-sm text-destructive text-center">{errorMessage}</p>}
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl">
                      Validate Code <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "validating" && (
            <motion.div key="validating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-muted-foreground">Validating your invitation...</p>
            </motion.div>
          )}

          {step === "details" && inviteDetails && (
            <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              <Card className="bg-blue-500/5 border-blue-500/20">
                <div className="p-6 text-center space-y-2">
                  <div className="text-sm text-blue-400 font-bold uppercase tracking-wider">You've been invited!</div>
                  <h2 className="text-2xl font-bold">{inviteDetails.organizationName}</h2>
                  <p className="text-muted-foreground">Invited by Coach <span className="text-foreground">{inviteDetails.coachName}</span></p>
                </div>
              </Card>

              {user ? (
                <Card className="bg-card/50 border-white/10 backdrop-blur-xl">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="text-emerald-500" />
                    </div>
                    <p className="mb-6">You are logged in as <strong>{user.email}</strong>.</p>
                    <Button onClick={() => handleAccept(user.uid)} className="w-full bg-blue-500 hover:bg-blue-600 py-6 rounded-xl">
                      Accept Invitation
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card/50 border-white/10 backdrop-blur-xl">
                  <div className="p-6">
                    <div className="mb-6 text-center">
                      <h3 className="font-bold text-lg">Create your account</h3>
                      <p className="text-sm text-muted-foreground">To join your team, create your free athlete profile.</p>
                    </div>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">First Name</label>
                          <Input required value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-background/50 border-white/10" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Last Name</label>
                          <Input required value={lastName} onChange={e => setLastName(e.target.value)} className="bg-background/50 border-white/10" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label>
                        <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-background/50 border-white/10" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Password</label>
                        <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-background/50 border-white/10" />
                      </div>
                      
                      {errorMessage && <p className="text-sm text-destructive text-center">{errorMessage}</p>}
                      
                      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl mt-2">
                        Create Account & Join
                      </Button>
                    </form>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
              <p className="text-muted-foreground">Linking your account to the organization...</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold mb-2">You're in!</h3>
              <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <div className="w-16 h-16 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Invalid Invitation</h3>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>
              <Button variant="outline" onClick={() => setStep("enter_code")} className="rounded-xl border-white/10">
                Try another code
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
