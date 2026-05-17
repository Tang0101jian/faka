import Link from "next/link";
import { RedeemForm } from "@/components/redeem-form";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#f8fafc_45%,#f8fafc_100%)] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white backdrop-blur">
          <div>
            <p className="text-sm font-medium tracking-[0.25em] text-cyan-300">1MOX CARD</p>
          </div>
          <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/10">
            管理后台
          </Link>
        </header>

        <section className="grid gap-12 px-2 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-white">
            <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              简单、直接、可快速上线的卡密兑换网站
            </div>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-tight lg:text-7xl">
              生成卡密，交付内容，
              <span className="text-cyan-300">一键完成兑换</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              你可以在后台批量生成卡密，设置使用次数、过期时间，并让用户通过卡密获取文本内容或文件下载链接。
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-sm text-zinc-400">支持类型</p>
                <p className="mt-3 text-2xl font-semibold">文本 / 文件</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-sm text-zinc-400">兑换控制</p>
                <p className="mt-3 text-2xl font-semibold">次数 / 过期</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-sm text-zinc-400">管理方式</p>
                <p className="mt-3 text-2xl font-semibold">后台批量发卡</p>
              </div>
            </div>
          </div>

          <div className="lg:pl-10">
            <RedeemForm />
          </div>
        </section>
      </div>
    </main>
  );
}
