import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import RedirectToast from "@/components/RedirectToast";
import { getSession } from "@/lib/session";

export const metadata = { title: "সাইন আপ" };

export default async function Page({ searchParams }: PageProps<"/signup">) {
  if (await getSession()) redirect("/");
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/";
  const reason = typeof sp.reason === "string" ? sp.reason : undefined;
  return (
    <div className="px-4 py-10">
      <RedirectToast reason={reason} />
      <AuthForm mode="signup" next={next} />
    </div>
  );
}
