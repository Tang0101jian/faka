import { ContentType } from "@prisma/client";

const CARD_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCardCode(length = 16) {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * CARD_CHARSET.length);
    return CARD_CHARSET[index];
  }).join("");
}

export function isCardExpired(expiresAt: Date | null) {
  return Boolean(expiresAt && expiresAt.getTime() < Date.now());
}

export function canRedeemCard(input: {
  isActive: boolean;
  usedCount: number;
  maxUses: number;
  expiresAt: Date | null;
}) {
  if (!input.isActive) {
    return { ok: false, message: "卡密已停用" };
  }

  if (isCardExpired(input.expiresAt)) {
    return { ok: false, message: "卡密已过期" };
  }

  if (input.usedCount >= input.maxUses) {
    return { ok: false, message: "卡密已被使用完" };
  }

  return { ok: true, message: "可兑换" };
}

export function getContentTypeLabel(type: ContentType) {
  return type === ContentType.FILE ? "文件" : "文本";
}
