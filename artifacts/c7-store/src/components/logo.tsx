import c7LogoUrl from "@/assets/c7-logo.svg";

export function Logo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src={c7LogoUrl}
      alt="C7 Convenience Store"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
