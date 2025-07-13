"use client"

import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <div>
        User Authenticated
      </div>
    )
  }

  return (
    <div>
      <button className="bg-white text-xl p-1 rounded text-black m-4" onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
