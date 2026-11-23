import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adapta | A prova do professor, adaptada para cada aluno neurodivergente",
  description:
    "A Adapta transforma a prova que o professor já elaborou em uma versão adaptada ao perfil de cada aluno neurodivergente e mostra quais adaptações funcionam.",
  openGraph: {
    title: "Adapta",
    description: "Adaptar a prova é só metade do problema. Veja quais adaptações funcionam e comprove a inclusão.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#4fb3e8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
