import { headers } from "next/headers";
import { z } from "zod";
import { canRedeemCard } from "@/lib/cards";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonSuccess } from "@/lib/responses";

const schema = z.object({
  code: z.string().min(6).max(64),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return jsonError("请输入正确的卡密");
  }

  const normalizedCode = parsed.data.code.trim().toUpperCase();
  const card = await prisma.card.findUnique({
    where: { code: normalizedCode },
  });

  if (!card) {
    return jsonError("卡密不存在", 404);
  }

  const redeemState = canRedeemCard(card);

  if (!redeemState.ok) {
    return jsonError(redeemState.message, 400);
  }

  const headerStore = await headers();
  const ipAddress =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const updated = await prisma.card.update({
    where: { id: card.id },
    data: {
      usedCount: {
        increment: 1,
      },
      logs: {
        create: {
          ipAddress,
        },
      },
    },
  });

  return jsonSuccess({
    code: updated.code,
    contentType: updated.contentType,
    contentValue: updated.contentValue,
    fileName: updated.fileName,
    remainingUses: Math.max(updated.maxUses - updated.usedCount, 0),
  });
}
