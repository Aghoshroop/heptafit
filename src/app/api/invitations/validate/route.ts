import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Invalid invitation code format." }, { status: 400 });
    }

    const upperCode = code.toUpperCase();
    const invitesRef = adminDb.collection("coachInvitations");
    const snapshot = await invitesRef.where("invitationCode", "==", upperCode).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid invitation code." }, { status: 404 });
    }

    const inviteDoc = snapshot.docs[0];
    const inviteData = inviteDoc.data();

    // Check expiration
    if (inviteData.expiresAt && new Date(inviteData.expiresAt) < new Date()) {
      await inviteDoc.ref.update({ status: "expired" });
      return NextResponse.json({ error: "This invitation has expired." }, { status: 410 });
    }

    // Check status
    if (["accepted", "registered", "active"].includes(inviteData.status)) {
      return NextResponse.json({ error: "This invitation has already been used." }, { status: 409 });
    }

    if (["revoked", "cancelled", "rejected"].includes(inviteData.status)) {
      return NextResponse.json({ error: "This invitation is no longer valid." }, { status: 403 });
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
