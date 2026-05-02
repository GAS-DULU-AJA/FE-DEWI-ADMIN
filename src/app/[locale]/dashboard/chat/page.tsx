"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Pin } from "lucide-react";

type ChannelType = "village_partner" | "organizer_village" | "support";

type Message = {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isRead: boolean;
  isPinned?: boolean;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  channelType: ChannelType;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Pengelola Desa",
    role: "Admin Desa",
    channelType: "village_partner",
    lastMessage: "Pendaftaran Anda sudah kami terima",
    lastTime: "10:30",
    unread: 2,
    messages: [
      { id: "m1", senderId: "admin", text: "Selamat datang di platform Mitra Desa Wisata!", time: "09:00", isRead: true, isPinned: true },
      { id: "m2", senderId: "me", text: "Terima kasih, saya sudah mendaftar sebagai penginapan.", time: "09:15", isRead: true },
      { id: "m3", senderId: "admin", text: "Baik, kami akan segera memverifikasi data Anda.", time: "09:20", isRead: true },
      { id: "m4", senderId: "admin", text: "Pendaftaran Anda sudah kami terima", time: "10:30", isRead: false },
    ],
  },
  {
    id: "2",
    name: "Komunitas Seni Cakra",
    role: "Event Organizer",
    channelType: "organizer_village",
    lastMessage: "Kapan Festival Panen Raya dimulai?",
    lastTime: "Kemarin",
    unread: 0,
    messages: [
      { id: "m1", senderId: "other", text: "Halo, kami ingin berkolaborasi untuk acara bulan depan.", time: "Kemarin 14:00", isRead: true },
      { id: "m2", senderId: "me", text: "Tentu, kami terbuka untuk kerjasama!", time: "Kemarin 14:30", isRead: true },
      { id: "m3", senderId: "other", text: "Kapan Festival Panen Raya dimulai?", time: "Kemarin 15:00", isRead: true },
    ],
  },
  {
    id: "3",
    name: "Toko Madu Hutan",
    role: "UMKM",
    channelType: "village_partner",
    lastMessage: "Stok madu sudah tersedia lagi",
    lastTime: "2 hari lalu",
    unread: 0,
    messages: [
      { id: "m1", senderId: "other", text: "Apakah madu hutan tersedia untuk dijual di platform?", time: "2 hari lalu 08:00", isRead: true },
      { id: "m2", senderId: "me", text: "Silakan daftarkan produk Anda di menu UMKM.", time: "2 hari lalu 09:00", isRead: true },
      { id: "m3", senderId: "other", text: "Stok madu sudah tersedia lagi", time: "2 hari lalu 10:00", isRead: true },
    ],
  },
  {
    id: "4",
    name: "Platform Support",
    role: "Support",
    channelType: "support",
    lastMessage: "Kami siap membantu 24/7",
    lastTime: "3 hari lalu",
    unread: 0,
    messages: [
      { id: "m1", senderId: "admin", text: "Halo! Selamat datang di Mitra Dewi Support. Ada yang bisa kami bantu?", time: "3 hari lalu 10:00", isRead: true, isPinned: true },
      { id: "m2", senderId: "admin", text: "Kami siap membantu 24/7", time: "3 hari lalu 10:01", isRead: true },
    ],
  },
];

const CHANNEL_TYPE_CLASS: Record<ChannelType, string> = {
  village_partner: "bg-primary/10 text-primary",
  organizer_village: "bg-violet-100 text-violet-700",
  support: "bg-blue-100 text-blue-700",
};

export default function ChatPage() {
  const t = useTranslations("chat");
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState("1");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showPinned, setShowPinned] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, selected?.messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: input,
              lastTime: t("justNow"),
              messages: [
                ...c.messages,
                { id: `m${Date.now()}`, senderId: "me", text: input, time: t("justNow"), isRead: true },
              ],
            }
          : c,
      ),
    );
    setInput("");
  };

  const handleMarkRead = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, isRead: true })) }
          : c,
      ),
    );
  };

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedMessages = showPinned
    ? selected.messages.filter((m) => m.isPinned)
    : selected.messages;

  const channelLabel = (ct: ChannelType) => t(`channelType.${ct}`);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-title-lg font-bold text-on-surface tracking-tight">{t("title")}</h1>
        <p className="mt-0.5 text-sm text-on-surface/60">{t("subtitle")}</p>
      </div>

      <div className="flex h-150 overflow-hidden rounded-2xl border-0 bg-surface-container-lowest shadow-ambient">
        <div className="w-72 shrink-0 border-r border-surface-container flex flex-col">
          <div className="p-3 border-b border-surface-container">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-on-surface/40" />
              <input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-surface-container-low border-0 focus:outline-none focus:ring-2 focus:ring-primary/300 focus:border-primary/400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  if (c.unread > 0) handleMarkRead(c.id);
                }}
                className={`w-full text-left flex items-start gap-3 p-3 border-b border-surface-container hover:bg-surface-container-low transition-colors ${selectedId === c.id ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
              >
                <Avatar name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-on-surface truncate">{c.name}</p>
                    <span className="text-[10px] text-on-surface/40 shrink-0 ml-1">{c.lastTime}</span>
                  </div>
                  <Badge className={`mt-0.5 text-[10px] px-1.5 py-0 ${CHANNEL_TYPE_CLASS[c.channelType]}`}>
                    {channelLabel(c.channelType)}
                  </Badge>
                  <p className="text-xs text-on-surface/60 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="rounded-full bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <Avatar name={selected.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-on-surface">{selected.name}</p>
                <p className="text-xs text-on-surface/40">{selected.role}</p>
              </div>
            </div>
            <button
              onClick={() => setShowPinned((v) => !v)}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${showPinned ? "bg-amber-100 text-amber-700" : "text-on-surface/40 hover:bg-surface-container"}`}
            >
              <Pin className="h-3 w-3" />
              {t("pinned")}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {showPinned && displayedMessages.length === 0 && (
              <p className="text-center text-sm text-on-surface/40 py-8">{t("noPinnedMessages")}</p>
            )}
            {displayedMessages.map((msg) => {
              const isMe = msg.senderId === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${isMe ? "order-2" : "flex gap-2"}`}>
                    {!isMe && <Avatar name={selected.name} size="sm" />}
                    <div>
                      {msg.isPinned && (
                        <div className="mb-1 flex items-center gap-1">
                          <Pin className="h-2.5 w-2.5 text-amber-500" />
                          <span className="text-[10px] text-amber-500">{t("pinned")}</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? "bg-primary text-white rounded-tr-sm"
                            : "bg-surface-container text-on-surface rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-on-surface/40 mt-1 ${isMe ? "text-right" : ""}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-surface-container flex gap-2">
            <input
              className="flex-1 rounded-xl border-0 bg-surface-container-low px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/300 focus:border-primary/400"
              placeholder={t("messagePlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
