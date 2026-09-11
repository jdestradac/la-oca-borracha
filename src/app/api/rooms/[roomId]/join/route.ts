import { NextRequest, NextResponse } from "next/server";
import { joinRoom } from "@/lib/room";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const result = await joinRoom(roomId);

  if ("error" in result) {
    const status = result.error === "not-found" ? 404 : 409;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
