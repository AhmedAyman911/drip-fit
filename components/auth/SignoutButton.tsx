"use client";

import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })} className="px-3 py-1 bg-red-500 text-white rounded">
            Logout
          </button>
  );
}
