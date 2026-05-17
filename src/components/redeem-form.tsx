"use client";

import { useState } from "react";

type RedeemResult = {
  code: string;
  contentType: "TEXT" | "FILE";
  contentValue: string;
  fileName: string | null;
  remainingUses: number;
};

export function RedeemForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResult(null);

    const response = await fetch("/api/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.message ?? "兑换失败");
      setLoading(false);
      return;
    }

    setResult(payload.data);
    setLoading(false);
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-600">输入卡密</label>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-zinc-900 outline-none transition focus:border-cyan-500"
            placeholder="例如：ABCD2345EFGH6789"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {loading ? "正在兑换..." : "立即兑换"}
        </button>
      </form>

      {message ? (
        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{message}</div>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-3 rounded-3xl bg-zinc-950 p-5 text-white">
          <p className="text-sm text-cyan-300">兑换成功：{result.code}</p>
          <p className="text-lg font-semibold">
            {result.contentType === "FILE" ? "文件下载信息" : "卡密内容"}
          </p>
          {result.contentType === "FILE" ? (
            <a
              href={result.contentValue}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
            >
              下载 {result.fileName ?? "文件"}
            </a>
          ) : (
            <p className="whitespace-pre-wrap rounded-2xl bg-white/10 p-4 text-sm text-zinc-100">
              {result.contentValue}
            </p>
          )}
          <p className="text-xs text-zinc-400">剩余可用次数：{result.remainingUses}</p>
        </div>
      ) : null}
    </div>
  );
}
