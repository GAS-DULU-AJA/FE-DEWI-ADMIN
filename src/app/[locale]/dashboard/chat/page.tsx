"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

type Message = {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isRead: boolean;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
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
    lastMessage: "Pendaftaran Anda sudah kami terima",
    lastTime: "10:30",
    unread: 2,
    messages: [
      { id: "m1", senderId: "admin", text: "Selamat datang di platform Mitra Desa Wisata!", time: "09:00", isRead: true },
      { id: "m2", senderId: "me", text: "Terima kasih, saya sudah mendaftar sebagai penginapan.", time: "09:15", isRead: true },
      { id: "m3", senderId: "admin", text: "Baik, kami akan segera memverifikasi data Anda.", time: "09:20", isRead: true },
      { id: "m4", senderId: "admin", text: "Pendaftaran Anda sudah kami terima", time: "10:30", isRead: false },
    ],
  },
  {
    id: "2",
    name: "Komunitas Seni Cakra",
    role: "Event Organizer",
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
    lastMessage: "Stok madu sudah tersedia lagi",
    lastTime: "2 hari lalu",
    unread: 0,
    messages: [
      { id: "m1", senderId: "other", text: "Apakah madu hutan tersedia untuk dijual di platform?", time: "2 hari lalu 08:00", isRead: true },
      { id: "m2", senderId: "me", text: "Silakan daftarkan produk Anda di menu UMKM.", time: "2 hari lalu 09:00", isRead: true },
      { id: "m3", senderId: "other", text: "Stok madu sudah tersedia lagi", time: "2 hari lalu 10:00", isRead: true },
    ],
  },
];

export default function ChatPage() {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState("1");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
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
              lastTime: "Baru saja",
              messages: [
                ...c.messages,
                { id: `m${Date.now()}`, senderId: "me", text: input, time: "Baru saja", isRead: true },
              ],
            }
          : c
      )
    );
    setInput("");
  };

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("dashboard.chat")}</h1>
        <p className="mt-0.5 text-sm text-stone-500">Pesan dan komunikasi internal</p>
      </div>

      <div className="flex h-[600px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-stone-100 flex flex-col">
          <div className="p-3 border-b border-stone-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                placeholder="Cari percakapan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left flex items-start gap-3 p-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${selectedId === c.id ? "bg-emerald-50 border-l-2 border-l-emerald-500" : ""}`}
              >
                <Avatar name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-stone-800 truncate">{c.name}</p>
                    <span className="text-[10px] text-stone-400 flex-shrink-0 ml-1">{c.lastTime}</span>
                  </div>
                  <p className="text-xs text-stone-400">{c.role}</p>
                  <p className="text-xs text-stone-500 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="rounded-full bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 flex-shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
            <Avatar name={selected.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-stone-900">{selected.name}</p>
              <p className="text-xs text-stone-400">{selected.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selected.messages.map((msg) => {
              const isMe = msg.senderId === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${isMe ? "order-2" : "flex gap-2"}`}>
                    {!isMe && <Avatar name={selected.name} size="sm" />}
                    <div>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm ${isMe
                        ? "bg-emerald-600 text-white rounded-tr-sm"
                        : "bg-stone-100 text-stone-800 rounded-tl-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-stone-400 mt-1 ${isMe ? "text-right" : ""}`}>{msg.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-stone-100 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
              placeholder="Tulis pesan..."
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
