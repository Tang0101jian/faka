import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/admin");
  }

  const cards = await prisma.card.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return <AdminDashboardClient initialCards={JSON.parse(JSON.stringify(cards))} />;
}
