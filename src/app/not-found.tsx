import type { Metadata } from "next";
import StateMessage from "@/components/StateMessage";

export const metadata: Metadata = { title: "পেজটি পাওয়া যায়নি" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <StateMessage
        emoji="🔍"
        title="পেজটি পাওয়া যায়নি"
        description="আপনি যে পেজ বা পণ্যটি খুঁজছেন সেটি পাওয়া যায়নি। লিংকটি ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।"
        action={{ href: "/", label: "হোম পেজে ফিরে যান" }}
      />
    </div>
  );
}
