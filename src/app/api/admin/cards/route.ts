import { ContentType } from "@prisma/client";
import { z } from "zod";
import { generateCardCode } from "@/lib/cards";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonSuccess } from "@/lib/responses";

const schema = z.object({
  count: z.number().int().min(1).max(100),
  contentType: z.nativeEnum(ContentType),
  contentValue: z.string().min(1, "内容不能为空"),
  fileName: z.string().optional(),
  maxUses: z.number().int().min(1).max(1000),
  expiresAt: z.string().optional().or(z.literal("")),
});

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return jsonError("未登录", 401);
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

  return jsonSuccess(cards);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return jsonError("未登录", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "参数错误");
  }

  const { count, contentType, contentValue, fileName, maxUses, expiresAt } = parsed.data;
  const createdCodes = new Set<string>();

  while (createdCodes.size < count) {
    createdCodes.add(generateCardCode());
  }

  const codes = Array.from(createdCodes);

  await prisma.card.createMany({
    data: codes.map((code) => ({
      code,
      contentType,
      contentValue,
      fileName,
      maxUses,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    })),
  });

  return jsonSuccess({ codes }, 201);
}
