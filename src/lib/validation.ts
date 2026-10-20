/** Pure form validation + redirect / error helpers (messages are in Bangla). */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const NAME_MIN = 2;
export const NAME_MAX = 60;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export function validateName(name: string): string | null {
  const value = name.trim();
  if (!value) return "নাম লিখুন।";
  if (value.length < NAME_MIN) return `নাম কমপক্ষে ${NAME_MIN} অক্ষরের হতে হবে।`;
  if (value.length > NAME_MAX) return `নাম ${NAME_MAX} অক্ষরের বেশি হতে পারবে না।`;
  return null;
}

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "ইমেইল লিখুন।";
  if (!EMAIL_PATTERN.test(value)) return "সঠিক ইমেইল ঠিকানা লিখুন।";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "পাসওয়ার্ড লিখুন।";
  if (password.length < PASSWORD_MIN) return `পাসওয়ার্ড কমপক্ষে ${PASSWORD_MIN} অক্ষরের হতে হবে।`;
  if (password.length > PASSWORD_MAX) return "পাসওয়ার্ড অনেক বড় হয়ে গেছে।";
  return null;
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateSignUp(input: SignUpInput): FieldErrors<keyof SignUpInput> {
  const errors: FieldErrors<keyof SignUpInput> = {};
  const name = validateName(input.name);
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);
  if (name) errors.name = name;
  if (email) errors.email = email;
  if (password) errors.password = password;
  if (!password && input.password !== input.confirmPassword) {
    errors.confirmPassword = "দুটি পাসওয়ার্ড একই হতে হবে।";
  }
  return errors;
}

export interface SignInInput {
  email: string;
  password: string;
}

export function validateSignIn(input: SignInInput): FieldErrors<keyof SignInInput> {
  const errors: FieldErrors<keyof SignInInput> = {};
  const email = validateEmail(input.email);
  if (email) errors.email = email;
  if (!input.password) errors.password = "পাসওয়ার্ড লিখুন।";
  return errors;
}

/**
 * Open-redirect protection: only same-site relative paths are accepted.
 * "/product/rice" -> ok, "https://evil.com", "//evil.com", "/\\evil.com" -> fallback.
 */
export function safeCallbackUrl(raw: string | null | undefined, fallback = "/"): string {
  if (typeof raw !== "string") return fallback;
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}

export interface AuthErrorLike {
  code?: string;
  message?: string;
  status?: number;
}

/** Maps Better Auth errors (code first, message as a fallback) to friendly Bangla messages. */
export function authErrorMessage(error: AuthErrorLike | null | undefined): string {
  if (!error) return "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
  const code = (error.code ?? "").toUpperCase();
  const message = (error.message ?? "").toUpperCase();
  const has = (...needles: string[]) => needles.some((needle) => code.includes(needle) || message.includes(needle));

  if (has("USER_ALREADY_EXISTS", "ALREADY EXISTS")) return "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।";
  if (has("INVALID_EMAIL_OR_PASSWORD", "INVALID_PASSWORD", "INVALID EMAIL OR PASSWORD")) {
    return "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
  }
  if (has("INVALID_EMAIL")) return "সঠিক ইমেইল ঠিকানা লিখুন।";
  if (has("PASSWORD_TOO_SHORT")) return `পাসওয়ার্ড কমপক্ষে ${PASSWORD_MIN} অক্ষরের হতে হবে।`;
  if (has("PASSWORD_TOO_LONG")) return "পাসওয়ার্ড অনেক বড় হয়ে গেছে।";
  if (has("USER_NOT_FOUND")) return "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।";
  if (has("PROVIDER_NOT_FOUND")) return "এই সোশ্যাল লগইনটি এখনো চালু করা হয়নি।";
  if (typeof error.status === "number" && error.status >= 500) {
    return "সার্ভারে সমস্যা হচ্ছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
  }
  if (error.status === 401 || error.status === 403) return "অনুমতি নেই। আবার সাইন ইন করুন।";
  if (error.status === 429) return "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ অপেক্ষা করুন।";
  return "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}
