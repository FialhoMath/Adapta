"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "sending" | "error" | "queued";

type Ctx = {
  total: number | null;
  status: Status;
  click: () => void;
};

const CtaContext = createContext<Ctx | null>(null);

const API = "/api/cta-clicks";
const COOLDOWN_MS = 1500; // ignora clique duplo acidental
const POLL_MS = 5000; // atualização "tempo real" entre visitantes
const RETRIES = 3;
const QUEUE_KEY = "adapta:pending-clicks";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readQueue(): string[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function writeQueue(q: string[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* storage indisponível: segue sem fila */
  }
}

/** Envia um clique com retry exponencial; o mesmo clickId garante idempotência no back-end. */
async function sendClick(clickId: string): Promise<number> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clickId }),
        keepalive: true,
      });
      if (res.ok) return (await res.json()).total as number;
      if (res.status < 500) throw new Error(`HTTP ${res.status}`); // erro do cliente: não adianta repetir
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    await sleep(500 * 2 ** attempt);
  }
  throw lastErr;
}

export function CtaProvider({ children }: { children: ReactNode }) {
  const [total, setTotal] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const inFlight = useRef(0);
  const lastClick = useRef(0);
  const router = useRouter();

  const refresh = useCallback(async () => {
    if (inFlight.current > 0) return; // não sobrescreve o valor otimista
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (res.ok) {
        const { total: t } = await res.json();
        if (inFlight.current === 0) setTotal(t);
      }
    } catch {
      /* offline: mantém último valor */
    }
  }, []);

  const flushQueue = useCallback(async () => {
    const queue = readQueue();
    if (!queue.length) return;
    const remaining: string[] = [];
    for (const id of queue) {
      try {
        setTotal(await sendClick(id));
      } catch {
        remaining.push(id);
      }
    }
    writeQueue(remaining);
    setStatus(remaining.length ? "queued" : "idle");
  }, []);

  // Carga inicial, polling (pausa com aba oculta) e reenvio ao reconectar
  useEffect(() => {
    refresh();
    flushQueue();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    const onOnline = () => flushQueue();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, [refresh, flushQueue]);

  const click = useCallback(() => {
    const now = Date.now();
    if (now - lastClick.current < COOLDOWN_MS) return; // clique duplicado acidental
    lastClick.current = now;

    // Navegação client-side: o app continua vivo, então retry/fila seguem funcionando
    router.push("/demonstracao");

    const clickId = crypto.randomUUID();
    inFlight.current++;
    setStatus("sending");
    setTotal((t) => (t ?? 0) + 1); // atualização otimista

    sendClick(clickId)
      .then((serverTotal) => {
        inFlight.current--;
        setTotal(serverTotal);
        setStatus("idle");
      })
      .catch(() => {
        inFlight.current--;
        setTotal((t) => Math.max(0, (t ?? 1) - 1)); // desfaz o otimista
        writeQueue([...readQueue(), clickId]); // reenviado quando a rede voltar
        setStatus("queued");
      });
  }, [router]);

  return <CtaContext.Provider value={{ total, status, click }}>{children}</CtaContext.Provider>;
}

function useCta() {
  const ctx = useContext(CtaContext);
  if (!ctx) throw new Error("useCta precisa estar dentro de <CtaProvider>");
  return ctx;
}

export function CtaButton({ size = "lg", className = "" }: { size?: "sm" | "lg"; className?: string }) {
  const { click, status } = useCta();
  const sizes = size === "lg" ? "px-8 py-4 text-lg" : "px-5 py-2.5 text-sm";
  return (
    <button
      type="button"
      onClick={click}
      aria-busy={status === "sending"}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent font-bold text-ink shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 active:translate-y-0 ${sizes} ${className}`}
    >
      Agendar demonstração
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
        <path d="M10.3 3.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l4.3-4.3H3a1 1 0 1 1 0-2h11.6l-4.3-4.3a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  );
}

export function ClickCounter({ className = "" }: { className?: string }) {
  const { total, status } = useCta();
  return (
    <p className={`text-sm text-ink/70 ${className}`} aria-live="polite">
      <span className="font-bold tabular-nums text-ink">
        {total === null ? "…" : total.toLocaleString("pt-BR")}
      </span>{" "}
      {total === 1 ? "pedido de demonstração" : "pedidos de demonstração"} até agora
      {status === "queued" && (
        <span className="mt-1 block text-xs text-red-600">
          Sem conexão: seu clique será registrado assim que a internet voltar.
        </span>
      )}
    </p>
  );
}
