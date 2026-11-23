import { existsSync } from "node:fs";
import path from "node:path";

// Verificado no servidor: usa /public/logo.png se existir; senão, mostra o wordmark.
const HAS_LOGO = existsSync(path.join(process.cwd(), "public", "logo.png"));

export function Logo({ className = "h-10" }: { className?: string }) {
  if (!HAS_LOGO) {
    return (
      <span className="text-2xl font-extrabold tracking-tight text-brand-dark">
        Adapta<span className="text-accent">.</span>
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="Adapta" className={`w-auto ${className}`} />;
}
