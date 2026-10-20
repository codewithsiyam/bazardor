import test from "node:test";
import assert from "node:assert/strict";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateSignUp,
  validateSignIn,
  safeCallbackUrl,
  authErrorMessage,
} from "../src/lib/validation.ts";

test("name validation (profile update + sign up)", () => {
  assert.ok(validateName(""));
  assert.ok(validateName("   "));
  assert.ok(validateName("র"));
  assert.equal(validateName("রহিম উদ্দিন"), null);
  assert.ok(validateName("a".repeat(61)));
});

test("email + password validation", () => {
  assert.equal(validateEmail("you@example.com"), null);
  assert.ok(validateEmail("you@example"));
  assert.ok(validateEmail(""));
  assert.equal(validatePassword("12345678"), null);
  assert.ok(validatePassword("1234567"));
});

test("sign-up form validation", () => {
  const ok = validateSignUp({ name: "রহিম", email: "a@b.co", password: "12345678", confirmPassword: "12345678" });
  assert.deepEqual(ok, {});
  const bad = validateSignUp({ name: "", email: "x", password: "123", confirmPassword: "" });
  assert.ok(bad.name && bad.email && bad.password);
  const mismatch = validateSignUp({ name: "রহিম", email: "a@b.co", password: "12345678", confirmPassword: "12345679" });
  assert.ok(mismatch.confirmPassword);
  assert.deepEqual(validateSignIn({ email: "a@b.co", password: "x" }), {});
  assert.ok(validateSignIn({ email: "", password: "" }).email);
});

test("safeCallbackUrl blocks open redirects", () => {
  assert.equal(safeCallbackUrl("/product/alu"), "/product/alu");
  assert.equal(safeCallbackUrl("/profile/update?x=1"), "/profile/update?x=1");
  assert.equal(safeCallbackUrl("https://evil.com"), "/");
  assert.equal(safeCallbackUrl("//evil.com"), "/");
  assert.equal(safeCallbackUrl("/\\evil.com"), "/");
  assert.equal(safeCallbackUrl("javascript:alert(1)"), "/");
  assert.equal(safeCallbackUrl(undefined), "/");
  assert.equal(safeCallbackUrl(null, "/home"), "/home");
  assert.equal(safeCallbackUrl("/a\nb"), "/");
});

test("auth error codes map to Bangla messages", () => {
  assert.match(authErrorMessage({ code: "USER_ALREADY_EXISTS" }), /আগেই অ্যাকাউন্ট/);
  assert.match(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD" }), /সঠিক নয়/);
  assert.match(authErrorMessage({ status: 500 }), /সার্ভারে সমস্যা/);
  assert.match(authErrorMessage({ status: 429 }), /অপেক্ষা/);
  assert.match(authErrorMessage(null), /সমস্যা/);
});

test("auth errors fall back to the message text when no code is present", () => {
  assert.match(authErrorMessage({ message: "Invalid email or password" }), /সঠিক নয়/);
  assert.match(authErrorMessage({ message: "User already exists" }), /আগেই অ্যাকাউন্ট/);
});
