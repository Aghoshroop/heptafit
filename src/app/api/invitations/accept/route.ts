import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { code, userId } = await req.json();

    if (!code || typeof code !== "string" || !userId) {
      return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
    }

    const upperCode = code.toUpperCase();
    const invitesRef = adminDb.collection("coachInvitations");
    const snapshot = await invitesRef.where("invitationCode", "==", upperCode).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Invalid invitation code." }, { status: 404 });
    }

    const inviteDoc = snapshot.docs[0];
    const inviteData = inviteDoc.data();

    // Check expiration and status
    if (inviteData.expiresAt && new Date(inviteData.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This invitation has expired." }, { status: 410 });
    }

    if (["accepted", "registered", "active"].includes(inviteData.status)) {
      return NextResponse.json({ error: "This invitation has already been used." }, { status: 409 });
    }

    if (["revoked", "cancelled", "rejected"].includes(inviteData.status)) {
      return NextResponse.json({ error: "This invitation is no longer valid." }, { status: 403 });
    }

    // Process Acceptance
    const batch = adminDb.batch();

    // 1. Update Invitation
    batch.update(inviteDoc.ref, {
      status: "registered", // State machine: registered (awaiting coach approval to be active, or immediately active based on requirements)
      acceptedAt: new Date().toISOString(),
      acceptedBy: userId,
    });

    // 2. Update User Document (Set their role and orgId if not set, though we should probably ensure they have an org array for existing users, but for now we follow the existing pattern)
    const userRef = adminDb.collection("users").doc(userId);
    batch.update(userRef, {
      organizationId: inviteData.organizationId,
      // If we don't want to overwrite an existing user's role, we should only set it if they don't have one.
      // But according to the current schema, they join as an athlete.
    });

    // 3. Create the Coach-Athlete Relationship
    if (inviteData.role === "athlete") {
      const relRef = adminDb.collection("coachAthleteRelationships").doc();
      batch.set(relRef, {
        coachId: inviteData.coachId,
        studentId: userId,
        organizationId: inviteData.organizationId,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }

    // 4. Log to Audit
    const auditRef = adminDb.collection("auditLogs").doc();
    batch.set(auditRef, {
      action: "invitation_accepted",
      invitationId: inviteDoc.id,
      invitationCode: upperCode,
      organizationId: inviteData.organizationId,
      userId: userId,
      timestamp: new Date().toISOString(),
      details: `User ${userId} accepted invitation ${upperCode} to join organization ${inviteData.organizationId}`
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Successfully joined organization",
      organizationId: inviteData.organizationId,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
