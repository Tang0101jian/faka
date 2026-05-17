"use client";

import { useMemo, useState } from "react";

type CardLog = {
  id: string;
  ipAddress: string | null;
  createdAt: string;
};

type CardItem = {
  id: string;
  code: string;
  contentType: "TEXT" | "FILE";
  contentValue: string;
  fileName: string | null;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  logs: CardLog[];
};

export function AdminDashboardClient({ initialCards }: { initialCards: CardItem[] }) {
  const [cards, setCards] = useState(initialCards);
  const [count, setCount] = useState(10);
  const [contentType, setContentType] = useState<"TEXT" | "FILE">("TEXT");
  const [contentValue, setContentValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const total = cards.length;
    const used = cards.filter((card) => card.usedCount > 0).length;
    const available = cards.filter((card) => card.usedCount < card.maxUses && card.isActive).length;
    return { total, used, available };
  }, [cards]);

  async function refreshCards() {
    const response = await fetch("/api/admin/cards", { cache: "no-store" });
    const result = await response.json();

    if (response.ok) {
      setCards(result.data);
    }
  }

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        count,
        contentType,
        contentValue,
        fileName: fileName || undefined,
        maxUses,
        expiresAt,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message ?? "创建失败");
      setLoading(false);
      return;
    }

    setMessage(`已生成 ${result.data.codes.length} 个卡密`);
    setContentValue("");
    setFileName("");
    setExpiresAt("");
    await refreshCards();
    setLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(180deg,#06121a_0%,#0f172a_52%,#f8fafc_52%,#f8fafc_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin Panel</p>
            <h1 className="mt-2 text-4xl font-semibold">发卡后台控制台</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
          >
            退出登录
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-zinc-300">总卡密数</p>
            <p className="mt-4 text-4xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-zinc-300">已使用过</p>
            <p className="mt-4 text-4xl font-semibold">{stats.used}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-zinc-300">当前可兑换</p>
            <p className="mt-4 text-4xl font-semibold">{stats.available}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          <form onSubmit={handleGenerate} className="space-y-4 rounded-[2rem] bg-white p-6 text-zinc-900 shadow-2xl shadow-cyan-950/10">
            <div>
              <p className="text-sm font-medium text-zinc-500">批量生成卡密</p>
              <h2 className="mt-2 text-2xl font-semibold">新建发卡批次</h2>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">生成数量</label>
              <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full rounded-2xl border border-zinc-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">内容类型</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value as "TEXT" | "FILE")} className="w-full rounded-2xl border border-zinc-200 px-4 py-3">
                <option value="TEXT">文本内容</option>
                <option value="FILE">文件链接</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{contentType === "FILE" ? "文件下载链接" : "兑换后展示的内容"}</label>
              <textarea value={contentValue} onChange={(e) => setContentValue(e.target.value)} className="min-h-28 w-full rounded-2xl border border-zinc-200 px-4 py-3" />
            </div>
            {contentType === "FILE" ? (
              <div>
                <label className="mb-2 block text-sm font-medium">文件名称</label>
                <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-2xl border border-zinc-200 px-4 py-3" />
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">可用次数</label>
                <input type="number" min={1} max={1000} value={maxUses} onChange={(e) => setMaxUses(Number(e.target.value))} className="w-full rounded-2xl border border-zinc-200 px-4 py-3" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">到期时间</label>
                <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full rounded-2xl border border-zinc-200 px-4 py-3" />
              </div>
            </div>
            {message ? <p className="text-sm text-cyan-700">{message}</p> : null}
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-zinc-400">
              {loading ? "生成中..." : "立即生成卡密"}
            </button>
          </form>

          <div className="rounded-[2rem] bg-white p-6 text-zinc-900 shadow-2xl shadow-cyan-950/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">卡密清单</p>
                <h2 className="mt-2 text-2xl font-semibold">最近生成的所有卡密</h2>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="px-3 py-3">卡密</th>
                    <th className="px-3 py-3">类型</th>
                    <th className="px-3 py-3">状态</th>
                    <th className="px-3 py-3">次数</th>
                    <th className="px-3 py-3">到期</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => {
                    const exhausted = card.usedCount >= card.maxUses;
                    return (
                      <tr key={card.id} className="border-b border-zinc-100 align-top">
                        <td className="px-3 py-4">
                          <div className="font-mono text-sm font-semibold">{card.code}</div>
                          <div className="mt-2 max-w-xs whitespace-pre-wrap text-xs text-zinc-500">{card.contentType === "FILE" ? card.fileName || card.contentValue : card.contentValue}</div>
                        </td>
                        <td className="px-3 py-4">{card.contentType === "FILE" ? "文件" : "文本"}</td>
                        <td className="px-3 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${exhausted ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {exhausted ? "已用完" : "可兑换"}
                          </span>
                        </td>
                        <td className="px-3 py-4">{card.usedCount}/{card.maxUses}</td>
                        <td className="px-3 py-4 text-xs text-zinc-500">{card.expiresAt ? new Date(card.expiresAt).toLocaleString() : "不过期"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
