"use client";

import { useUserStore } from "@/store/userStore";

export default function Results() {
  const userData = useUserStore((state) => state.userData);

  return <div>{JSON.stringify(userData)}</div>;
}
