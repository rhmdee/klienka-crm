"use client";

import { useEffect } from "react";
import { useAppStore, UserProfile } from "@/stores/useAppStore";

export function UserStoreHydrator({ user }: { user: UserProfile | null }) {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

  return null;
}
