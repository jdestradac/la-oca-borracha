import { NextRequest, NextResponse } from "next/server";
import { rollForPlayer } from "@/lib/room";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const body = await request.json().catch(() => null);
  const playerId = Number(body?.playerId);

  if (!Number.isInteger(playerId) || playerId < 0) {
    return NextResponse.json({ error: "invalid-player" }, { status: 400 });
  }

  const result = await rollForPlayer(roomId, playerId);
  if ("error" in result) {
    const status = result.error === "not-found" ? 404 : 409;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
