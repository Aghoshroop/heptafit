import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Invalid invitation code format." }, { status: 400 });
    }

    const upperCode = code.trim().toUpperCase();
    console.log("[INVITE VALIDATION] Received code:", code, "-> Normalized:", upperCode);

    const invitesRef = adminDb.collection("coachInvitations");
    const snapshot = await invitesRef.where("invitationCode", "==", upperCode).get();
    
    console.log(`[INVITE VALIDATION] Firestore query returned ${snapshot.size} matching documents.`);

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invitation not found. Please check the code and try again." }, { status: 404 });
    }

    const inviteDoc = snapshot.docs[0];
    const inviteData = inviteDoc.data();
    console.log("[INVITE VALIDATION] Invitation Document:", { id: inviteDoc.id, ...inviteData });

    // Validate essential properties exist
    if (!inviteData.organizationId || !inviteData.coachId || !inviteData.role) {
      console.error("[INVITE VALIDATION] Invitation is missing required fields (organizationId, coachId, role):", inviteData);
      return NextResponse.json({ error: "Invitation is corrupted. Please contact the coach to issue a new one." }, { status: 500 });
    }

    // Check expiration
    if (inviteData.expiresAt && new Date(inviteData.expiresAt) < new Date()) {
      await inviteDoc.ref.update({ status: "expired" });
      console.log(`[INVITE VALIDATION] Invitation ${upperCode} expired at ${inviteData.expiresAt}`);
      return NextResponse.json({ error: "This invitation has expired. Please request a new one." }, { status: 410 });
    }

    // Check status
    if (["accepted", "registered", "active"].includes(inviteData.status)) {
      console.log(`[INVITE VALIDATION] Invitation ${upperCode} already used. Status: ${inviteData.status}`);
      return NextResponse.json({ error: "This invitation has already been used." }, { status: 409 });
    }

    if (["revoked", "cancelled", "rejected"].includes(inviteData.status)) {
      console.log(`[INVITE VALIDATION] Invitation ${upperCode} revoked. Status: ${inviteData.status}`);
      return NextResponse.json({ error: "This invitation has been revoked and is no longer valid." }, { status: 403 });
    }

    // If pending, mark as opened
    if (inviteData.status === "pending") {
      await inviteDoc.ref.update({
        status: "opened",
        openedAt: new Date().toISOString()
      });
      
      // Log to auditLogs
      await adminDb.collection("auditLogs").add({
        action: "invitation_opened",
        invitationId: inviteDoc.id,
        invitationCode: upperCode,
        organizationId: inviteData.organizationId,
        timestamp: new Date().toISOString(),
        details: "Invitation was opened and validated by a prospective user."
      });
    }

    // Fetch Organization Details
    const orgDoc = await adminDb.collection("organizations").doc(inviteData.organizationId).get();
    const orgData = orgDoc.exists ? orgDoc.data() : null;

    // Fetch Coach Details
    const coachDoc = await adminDb.collection("users").doc(inviteData.coachId).get();
    const coachData = coachDoc.exists ? coachDoc.data() : null;

    return NextResponse.json({
      valid: true,
      role: inviteData.role || "athlete",
      organizationName: orgData?.name || "Unknown Organization",
      coachName: coachData ? `${coachData.firstName} ${coachData.lastName}` : "Your Coach",
      expiresAt: inviteData.expiresAt,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error validating invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
