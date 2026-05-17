import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { requireAdmin } from "@/lib/admin";

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#155e75_100%)] px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Card Delivery System</p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-tight">一个简单直接的在线发卡网站后台</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            管理员可批量生成卡密，用户输入卡密后即可获取文本内容或文件下载链接。
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
