import { Suspense } from "react";
import AuthPage from "@/components/AuthPage";
import { AuthSkeleton } from "@/components/Skeletons";

export const metadata = { title: "সাইন আপ" };

export default function Page({ searchParams }: PageProps<"/signup">) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthPage mode="signup" searchParams={searchParams} />
    </Suspense>
  );
}
