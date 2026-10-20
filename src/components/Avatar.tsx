import { getInitial } from "@/lib/utils";

interface AvatarProps {
  name: string;
  image?: string | null;
  /** Tailwind size classes, e.g. "size-9" */
  className?: string;
  textClassName?: string;
}

/** Image when the account has one (Google / GitHub), otherwise the first letter. */
export default function Avatar({
  name,
  image,
  className = "size-9",
  textClassName = "text-sm",
}: AvatarProps) {
  const initial = getInitial(name);

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote avatar of arbitrary provider host
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} ${textClassName} grid shrink-0 place-items-center rounded-full bg-primary font-semibold text-primary-content`}
    >
      {initial}
    </span>
  );
}
