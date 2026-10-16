import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Tarefa = {
  id: string;
  titulo: string;
  concluida: boolean;
  prioridade: "baixa" | "media" | "alta";
};

interface PainelProps {
  usuario: string;
  rodape?: ReactNode;
}

const CORES_PRIORIDADE = {
  baixa: "#4CC9A6",
  media: "#E5B567",
  alta: "#E3809B",
} as const;

export function Painel({ usuario, rodape }: PainelProps) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controle = new AbortController();

    fetch(`/api/tarefas?usuario=${encodeURIComponent(usuario)}`, { signal: controle.signal })
      .then((res) => res.json())
      .then((dados: Tarefa[]) => setTarefas(dados))
      .catch((erro) => console.error("Falha ao carregar:", erro))
      .finally(() => setCarregando(false));

    return () => controle.abort();
  }, [usuario]);

  const visiveis = useMemo(
    () => tarefas.filter((t) => t.titulo.toLowerCase().includes(filtro.toLowerCase())),
    [tarefas, filtro],
  );

  const alternar = (id: string) =>
    setTarefas((atual) =>
      atual.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)),
    );

  if (carregando) return <p className="aviso">Carregando…</p>;

  return (
    <section className="painel" aria-label="Lista de tarefas">
      <header>
        <h1>Olá, {usuario} 🌿</h1>
        <input
          type="search"
          placeholder="Filtrar tarefas"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </header>

      <ul>
        {visiveis.map((tarefa) => (
          <li key={tarefa.id} style={{ borderColor: CORES_PRIORIDADE[tarefa.prioridade] }}>
            <label>
              <input
                type="checkbox"
                checked={tarefa.concluida}
                onChange={() => alternar(tarefa.id)}
              />
              {tarefa.titulo}
            </label>
          </li>
        ))}
      </ul>

      {visiveis.length === 0 && <p>Nenhuma tarefa encontrada.</p>}
      {rodape}
    </section>
  );
}
