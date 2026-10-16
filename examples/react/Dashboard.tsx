import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: "low" | "medium" | "high";
};

interface DashboardProps {
  user: string;
  footer?: ReactNode;
}

const PRIORITY_COLORS = {
  low: "#4CC9A6",
  medium: "#E5B567",
  high: "#E3809B",
} as const;

export function Dashboard({ user, footer }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/tasks?user=${encodeURIComponent(user)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch((error) => console.error("Failed to load:", error))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [user]);

  const visible = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(filter.toLowerCase())),
    [tasks, filter],
  );

  const toggle = (id: string) =>
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  if (loading) return <p className="notice">Loading…</p>;

  return (
    <section className="dashboard" aria-label="Task list">
      <header>
        <h1>Hello, {user} 🌿</h1>
        <input
          type="search"
          placeholder="Filter tasks"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </header>

      <ul>
        {visible.map((task) => (
          <li key={task.id} style={{ borderColor: PRIORITY_COLORS[task.priority] }}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggle(task.id)}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>

      {visible.length === 0 && <p>No tasks found.</p>}
      {footer}
    </section>
  );
}
