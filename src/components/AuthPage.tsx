import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import RedirectToast from "@/components/RedirectToast";
import { enabledProviders } from "@/lib/env";
import { getSession } from "@/lib/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Server component that reads searchParams + the session. It is rendered inside <Suspense> by the
 * /signin and /signup pages, which is what Next.js requires for request-time data.
 */
export default async function AuthPage({ mode, searchParams }: { mode: "signin" | "signup"; searchParams: SearchParams }) {
  if (await getSession()) redirect("/");
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/";
  const reason = typeof sp.reason === "string" ? sp.reason : undefined;
  const error = typeof sp.error === "string" ? sp.error : undefined;
  return (
    <div className="px-4 py-10">
      <RedirectToast reason={reason} error={error} />
      <AuthForm mode={mode} next={next} providers={enabledProviders()} />
    </div>
  );
}
