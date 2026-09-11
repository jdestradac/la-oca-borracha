import { NextRequest, NextResponse } from "next/server";
import { getRoom } from "@/lib/room";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ state: room.state, claimedSeats: room.claimedSeats });
}
