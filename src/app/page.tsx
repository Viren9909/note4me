"use client"

import { toast } from "sonner";

export default function Home() {
  
  const handleClick = () => {
    toast("This is a toast message!", {
      description: "You can customize the toast message.",
      duration: 5000,
      position: "bottom-right",
      style: {
        backgroundColor: "#333",
        color: "#fff",
      },
    });
  }

  return (
    <div>
      <button className="bg-white text-xl p-1 rounded text-black m-4" onClick={handleClick}>Sign in</button>
    </div>
  );
}
