import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Demonstração | Adapta",
  robots: { index: false },
};

export default function Demonstracao() {
  return (
    <>
      <header className="border-b border-brand/15 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-3">
          <Link href="/" aria-label="Adapta, voltar à página inicial">
            <Logo className="h-9" />
          </Link>
        </div>
      </header>

      <main className="relative flex min-h-[70vh] items-center overflow-hidden bg-gradient-to-b from-brand-light to-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-5 py-24 text-center">
          <p className="mb-5 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            Landing page de teste
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Obrigado pelo interesse na Adapta!
          </h1>
          <p className="mt-6 text-lg text-ink/75">
            Esta é uma landing page de teste. O agendamento de demonstrações ainda não está disponível, mas quem
            sabe em breve esteja funcionando.
          </p>
          <p className="mt-3 text-ink/60">Seu clique foi registrado e nos ajuda a medir o interesse no projeto.</p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
