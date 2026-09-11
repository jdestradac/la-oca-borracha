"use client";

import { useContext } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { OnlineGameContext } from "@/context/OnlineGameContext";

/** Renders nothing in local pass-and-play mode (no OnlineGameContext mounted). */
export function RoomBadge() {
  const online = useContext(OnlineGameContext);
  const { t } = useLanguage();
  if (!online || !online.roomId) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
      <span className="font-semibold text-[var(--text-dim)]">
        {t("yourRoomCode")} <span className="font-bold text-[var(--cyan)]">{online.roomId}</span>
      </span>
      {online.myPlayerId !== null && (
        <span className="font-semibold text-[var(--text-dim)]">
          {t("youArePlayer")} <span className="font-bold text-[var(--pink)]">{online.myPlayerId + 1}</span>
        </span>
      )}
      <button
        type="button"
        onClick={online.leaveRoom}
        className="font-semibold text-[var(--text-dim)] underline-offset-4 hover:underline"
      >
        {t("leaveRoom")}
      </button>
    </div>
  );
}
