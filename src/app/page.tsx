import { CtaProvider, CtaButton, ClickCounter } from "@/components/CtaCounter";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

const STATS = [
  { value: "2,5 mi", label: "matrículas na Educação Especial" },
  { value: "92,6%", label: "dessas matrículas estão em classes comuns" },
  { value: "6,4%", label: "dos professores regentes têm formação continuada na área" },
];

const STEPS = [
  {
    title: "Use a prova que você já fez",
    text: "Nada de começar do zero. A Adapta parte da avaliação que o próprio professor elaborou.",
  },
  {
    title: "Uma versão para cada perfil",
    text: "A plataforma transforma a prova em uma versão adaptada ao perfil de cada aluno neurodivergente.",
  },
  {
    title: "Adaptação ligada ao resultado",
    text: "Cada adaptação fica vinculada ao desempenho do aluno: o que foi feito e como ele se saiu.",
  },
];

const BENEFITS = [
  {
    who: "Professor",
    title: "Veja quais adaptações funcionam",
    text: "Pare de adaptar no escuro. Os resultados mostram o que ajuda cada aluno de verdade.",
  },
  {
    who: "Escola",
    title: "Comprove a inclusão exigida por lei",
    text: "Registro de cada adaptação e do seu resultado, alinhado à Lei Brasileira de Inclusão (Lei nº 13.146/2015).",
  },
  {
    who: "Aluno",
    title: "Uma prova pensada para ele",
    text: "Avaliação adaptada ao seu perfil, dentro da sala de aula comum.",
  },
];

export default function Home() {
  return (
    <CtaProvider>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-brand/15 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#topo" aria-label="Adapta, voltar ao topo">
            <Logo className="h-9" />
          </a>
          <nav className="hidden gap-8 text-sm font-semibold text-ink/70 md:flex" aria-label="Principal">
            <a href="#problema" className="hover:text-brand-dark">Problema</a>
            <a href="#como-funciona" className="hover:text-brand-dark">Como funciona</a>
            <a href="#beneficios" className="hover:text-brand-dark">Benefícios</a>
          </nav>
          <CtaButton size="sm" />
        </div>
      </header>

      <main id="topo">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-white">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-sm">
                Educação inclusiva
              </p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-6xl">
                Adaptar a prova é só <span className="text-brand">metade</span> do problema.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink/75">
                A Adapta transforma a prova que o professor já elaborou em uma versão adaptada ao perfil de cada
                aluno neurodivergente. E mostra se a adaptação funcionou.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <CtaButton />
                <ClickCounter />
              </div>
            </div>

            {/* Ilustração: prova original -> versões adaptadas */}
            <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
              <div className="rounded-3xl bg-white p-6 shadow-xl shadow-brand/15 ring-1 ring-brand/10">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Prova original</p>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded bg-ink/10" />
                  <div className="h-3 w-5/6 rounded bg-ink/10" />
                  <div className="h-3 w-4/6 rounded bg-ink/10" />
                </div>
              </div>
              <div className="my-4 flex justify-center text-brand">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Perfil A", "Perfil B"].map((p) => (
                  <div key={p} className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-brand/15">
                    <p className="text-xs font-bold text-brand-dark">{p}</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2.5 w-full rounded bg-brand/25" />
                      <div className="h-2.5 w-3/4 rounded bg-brand/25" />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-ink/60">
                      <span className="h-2 w-2 rounded-full bg-accent" /> resultado registrado
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Problema */}
        <section id="problema" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              A inclusão já está na sala de aula. O preparo, ainda não.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.value} className="rounded-3xl border border-brand/15 bg-brand-light/60 p-8">
                  <p className="text-5xl font-extrabold text-brand-dark">{s.value}</p>
                  <p className="mt-3 text-ink/75">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-lg text-ink/75">
              O professor regente adapta a prova sozinho e sem saber se deu certo. A escola precisa comprovar a
              inclusão, mas não tem registro do que foi feito.
            </p>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="scroll-mt-20 bg-brand-light/50 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Como funciona</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-ink/75">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefícios */}
        <section id="beneficios" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Ganho para todos na sala</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {BENEFITS.map((b) => (
                <article key={b.who} className="rounded-3xl border border-brand/15 p-8 transition hover:shadow-lg">
                  <p className="inline-block rounded-full bg-accent/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                    {b.who}
                  </p>
                  <h3 className="mt-4 text-xl font-bold">{b.title}</h3>
                  <p className="mt-2 text-ink/75">{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-brand px-8 py-16 text-center text-white md:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Veja a Adapta funcionando com uma prova da sua escola.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              Agende uma demonstração e descubra quais adaptações funcionam para os seus alunos.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <CtaButton />
              <div className="rounded-full bg-white/95 px-4 py-1.5">
                <ClickCounter />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </CtaProvider>
  );
}
