import { Logo } from "@/components/Logo";
import { CONTACT } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-brand/15 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo className="h-9" />
          <p className="mt-2 text-sm text-ink/60">A prova do professor, adaptada para cada aluno.</p>
        </div>
        <address className="flex flex-col gap-2 text-sm not-italic text-ink/80 md:items-end">
          <a href={`https://wa.me/${CONTACT.phoneE164}`} className="hover:text-brand-dark" target="_blank" rel="noopener noreferrer">
            WhatsApp {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-dark">{CONTACT.email}</a>
          <a href={CONTACT.instagramUrl} className="hover:text-brand-dark" target="_blank" rel="noopener noreferrer">
            Instagram {CONTACT.instagram}
          </a>
        </address>
      </div>
      <p className="mt-10 text-center text-xs text-ink/50">© {new Date().getFullYear()} Adapta. Projetos 4, G6, CESAR School.</p>
    </footer>
  );
}
