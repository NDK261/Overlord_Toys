"use client";

import { useUser, UserProfile } from "@/hooks/useUser";
import { AccountForm } from "./AccountForm";
import { SecurityForm } from "./SecurityForm";

export function AccountFormWrapper({ initialProfile, userEmail }: { initialProfile: UserProfile | null, userEmail: string }) {
  const { updateProfile } = useUser();
  return <AccountForm initialProfile={initialProfile} userEmail={userEmail} updateProfile={updateProfile} />;
}

export function SecurityFormWrapper() {
  const { updatePassword } = useUser();
  return <SecurityForm updatePassword={updatePassword} />;
}
