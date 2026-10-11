import { Suspense } from "react";
import AuthPage from "@/components/AuthPage";
import { AuthSkeleton } from "@/components/Skeletons";

export const metadata = { title: "সাইন ইন" };

export default function Page({ searchParams }: PageProps<"/signin">) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthPage mode="signin" searchParams={searchParams} />
    </Suspense>
  );
}
