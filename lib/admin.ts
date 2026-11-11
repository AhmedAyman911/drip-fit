import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// A comma-separated ADMIN_EMAILS env var overrides the default owner account.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "ahmedayman9113@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

/** Returns the session when the signed-in user is an admin, otherwise null. */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  return isAdminEmail(session?.user?.email) ? session : null;
}
