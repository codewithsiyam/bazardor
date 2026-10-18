interface AuthErrorLike {
  code?: string;
  message?: string;
  status?: number;
}

/** Maps Better Auth errors to readable Bangla messages. */
export function toBanglaAuthError(error: AuthErrorLike | null | undefined, fallback: string): string {
  const text = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  if (text.includes("invalid email or password") || text.includes("invalid_email_or_password")) {
    return "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
  }
  if (text.includes("already") && text.includes("exist")) {
    return "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। সাইন ইন করুন।";
  }
  if (text.includes("password") && text.includes("short")) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
  if (text.includes("password") && text.includes("long")) return "পাসওয়ার্ড অনেক বড় হয়ে গেছে।";
  if (text.includes("invalid email")) return "সঠিক ইমেইল ঠিকানা দিন।";
  if (error?.status === 429) return "অনেকবার চেষ্টা করা হয়েছে। একটু পরে আবার চেষ্টা করুন।";
  if (error?.status && error.status >= 500) return "সার্ভারে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।";
  return fallback;
}
