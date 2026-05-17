"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.message ?? "登录失败");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white p-8 text-zinc-900 shadow-2xl shadow-cyan-950/10">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-600">管理员账号</label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-cyan-500"
          placeholder="请输入账号"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-600">管理员密码</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-cyan-500"
          placeholder="请输入密码"
        />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {loading ? "登录中..." : "进入后台"}
      </button>
    </form>
  );
}
