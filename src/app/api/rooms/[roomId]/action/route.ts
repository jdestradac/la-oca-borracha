import { NextRequest, NextResponse } from "next/server";
import { dispatchRoomAction } from "@/lib/room";

/** Only actions safe for a client to trigger directly go through this route.
 * Dice rolls have their own endpoint (server picks the random number). */
const ALLOWED_TYPES = new Set(["RESOLVE_MODAL", "RESTART"]);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const body = await request.json().catch(() => null);
  const type = body?.type;

  if (typeof type !== "string" || !ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: "invalid-action" }, { status: 400 });
  }

  const playerId = Number.isInteger(body?.playerId) ? Number(body.playerId) : null;
  const action =
    type === "RESOLVE_MODAL"
      ? ({ type: "RESOLVE_MODAL", tookShot: Boolean(body?.tookShot) } as const)
      : ({ type: "RESTART" } as const);

  const result = await dispatchRoomAction(roomId, action, playerId);
  if ("error" in result) {
    const status = result.error === "not-found" ? 404 : 409;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
