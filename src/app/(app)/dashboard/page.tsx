'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <div>
      DashBoard
    </div>
  )
}

export default page
