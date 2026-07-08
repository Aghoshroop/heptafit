export const dynamic = 'force-dynamic';

import { JoinClient } from "../join/JoinClient";

export default function InvitePage({ params }: { params: { code: string } }) {
  // In Next.js App Router, params in Server Components might need to be awaited in future versions, 
  // but for simple string extraction, we pass it to the client component.
  return <JoinClient initialCode={params.code} />;
}
