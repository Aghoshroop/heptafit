"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserBase, StudentProfile, CoachProfile, AccountType } from "@/lib/types";

// Extended UserData to support backwards compatibility and new types
export interface UserData extends Omit<UserBase, 'accountType'> {
  profile?: StudentProfile | CoachProfile;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  accountType: AccountType | "super_admin" | null;
  onboardingStatus: "pending" | "completed";
  subscriptionStatus?: "active" | "inactive" | "trial" | "past_due";
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Production Authentication mode: DEV_MODE is fully removed
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setLoading(true); // Ensure loading is true while we fetch
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          // Check for super admin hardcoded email for safety backup
          if (currentUser.email === "aviroopghosh283@gmail.com") {
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email,
              accountType: "super_admin",
              firstName: "Super",
              lastName: "Admin",
              onboardingStatus: "completed",
              createdAt: Timestamp.now()
            });
            setLoading(false);
            return;
          }

          if (userDoc.exists()) {
            const baseData = userDoc.data() as UserBase;
            let profileData: StudentProfile | CoachProfile | undefined;
            let orgStatus: any = undefined;
            
            // Fetch role-specific profile
            if (baseData.accountType === "athlete") {
              const studentDoc = await getDoc(doc(db, "students", currentUser.uid));
              if (studentDoc.exists()) profileData = studentDoc.data() as StudentProfile;
            } else if (baseData.accountType === "head_coach" || baseData.accountType === "assistant_coach") {
              const coachDoc = await getDoc(doc(db, "coaches", currentUser.uid));
              if (coachDoc.exists()) profileData = coachDoc.data() as CoachProfile;
            } else if (baseData.accountType === "support_staff") {
              const staffDoc = await getDoc(doc(db, "staff", currentUser.uid));
              if (staffDoc.exists()) profileData = staffDoc.data() as any;
            }

            const orgId = (profileData as any)?.organizationId || (baseData as any).organizationId;

            // Fetch organization to get subscription status if applicable
            if (orgId) {
              const orgDoc = await getDoc(doc(db, "organizations", orgId));
              if (orgDoc.exists()) {
                orgStatus = orgDoc.data().subscriptionStatus || "active";
              }
            }

            setUserData({
              ...baseData,
              uid: currentUser.uid,
              profile: profileData,
              firstName: profileData?.firstName || (baseData as any).firstName,
              lastName: profileData?.lastName || (baseData as any).lastName,
              organizationId: orgId,
              accountType: baseData.accountType,
              onboardingStatus: profileData ? "completed" : "pending",
              subscriptionStatus: orgStatus
            });
          } else {
            // User authenticated but no profile doc -> Needs onboarding
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
