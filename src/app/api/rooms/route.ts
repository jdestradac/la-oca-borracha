import { NextRequest, NextResponse } from "next/server";
import { createRoom } from "@/lib/room";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const numPlayers = Number(body?.numPlayers);

  if (!Number.isInteger(numPlayers) || numPlayers < 3 || numPlayers > 15) {
    return NextResponse.json({ error: "invalid-num-players" }, { status: 400 });
  }

  const { roomId, playerId, state } = await createRoom(numPlayers);
  return NextResponse.json({ roomId, playerId, state });
}
