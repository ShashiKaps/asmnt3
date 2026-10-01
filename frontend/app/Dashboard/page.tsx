"use client";

import { useEffect, useState } from "react";
import { fetchHealth, fetchStats, HealthStatus, Stats } from "../lib/api";

function formatMs(ms: number) {
  if (ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return `${minutes}m ${rem}s`;
}

function Card({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="border border-[var(--border)] rounded p-4 bg-[var(--card-bg)] flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-[var(--muted-text)]">{label}</span>
      <span className={`text-2xl font-semibold ${accent ?? ""}`}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => {
      Promise.all([fetchHealth(), fetchStats()])
        .then(([h, s]) => {
          setHealth(h);
          setStats(s);
          setError("");
        })
        .catch(() => setError("Could not load dashboard data from the API."));
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const totalGenerations = stats ? stats.generationCounts.success + stats.generationCounts.failure : 0;
  const failureRate = stats && totalGenerations > 0 ? Math.round((stats.generationCounts.failure / totalGenerations) * 100) : 0;

  return (
    <div className="bg-[var(--page-bg)] text-[var(--page-text)] p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">Builder Dashboard</h1>
          {health && (
            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${
                health.status === "ok" ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"
              }`}
            >
              {health.status === "ok" ? "● Healthy" : "● Unhealthy"} — uptime {formatMs(health.uptimeMs)}
            </span>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card label="Word Lists" value={stats.wordListCount} />
              <Card label="Wordle Activities" value={stats.activityConfigCounts.wordle ?? 0} />
              <Card label="Word Search Activities" value={stats.activityConfigCounts.wordsearch ?? 0} />
              <Card label="Most-Used Activity" value={stats.mostUsedActivityType ?? "—"} />
              <Card label="Successful Generations" value={stats.generationCounts.success ?? 0} accent="text-green-400" />
              <Card label="Failed Generations" value={stats.generationCounts.failure ?? 0} accent="text-red-400" />
              <Card label="Failure Rate" value={`${failureRate}%`} />
              <Card label="Avg. Time on Page" value={formatMs(stats.averageTimeOnPageMs)} />
            </div>

            <div className="border border-[var(--border)] rounded p-4">
              <h2 className="font-semibold text-sm mb-3">Page Views</h2>
              <div className="flex gap-6 flex-wrap text-sm">
                {Object.entries(stats.pageViewCounts).map(([page, count]) => (
                  <span key={page} className="text-[var(--muted-text)]">
                    <span className="text-[var(--page-text)] font-semibold">{count}</span> {page}
                  </span>
                ))}
                {Object.keys(stats.pageViewCounts).length === 0 && (
                  <span className="text-[var(--muted-text)]">No page views recorded yet.</span>
                )}
              </div>
            </div>

            <div className="border border-[var(--border)] rounded p-4">
              <h2 className="font-semibold text-sm mb-3">Recent Failures / Warnings</h2>
              {stats.recentFailures.length === 0 ? (
                <p className="text-sm text-[var(--muted-text)]">No recent failures.</p>
              ) : (
                <ul className="flex flex-col gap-2 text-sm">
                  {stats.recentFailures.map((f) => (
                    <li key={f.id} className="flex items-center gap-3 text-red-300">
                      <span>⚠</span>
                      <span className="font-semibold">{f.activityType}</span>
                      <span className="text-[var(--muted-text)]">{f.errorReason ?? "unknown error"}</span>
                      <span className="text-xs text-[var(--muted-text)] ml-auto">
                        {new Date(f.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
