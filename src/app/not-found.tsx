import Link from "next/link";
import StatusCard from "@/components/StatusCard";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <StatusCard
        emoji="🔍"
        title="পেজটি পাওয়া যায়নি"
        description="আপনি যে পেজ, ক্যাটাগরি বা পণ্যটি খুঁজছেন সেটি নেই — লিংকটি ভুল হতে পারে অথবা সরিয়ে ফেলা হয়েছে।"
      >
        <Link href="/" className="btn btn-primary">
          হোম পেজে ফিরে যান
        </Link>
      </StatusCard>
    </div>
  );
}
