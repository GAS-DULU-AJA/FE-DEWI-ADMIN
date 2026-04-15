import type { ApiResponse, QueryParams } from "../types";
import type { IChatService, Conversation, ChatMessage } from "../chat.service";

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const mockConversations: Conversation[] = [
  { id: "conv-1", participantId: "user-2", participantName: "Admin Desa", lastMessage: "Terima kasih infonya", lastMessageAt: "2026-04-14T08:00:00Z", unreadCount: 2 },
  { id: "conv-2", participantId: "user-3", participantName: "Pengelola Event", lastMessage: "Kapan jadwal berikutnya?", lastMessageAt: "2026-04-13T15:00:00Z", unreadCount: 0 },
];

const mockMessages: ChatMessage[] = [
  { id: "msg-1", conversationId: "conv-1", senderId: "user-2", content: "Halo, ada info baru?", messageType: "text", createdAt: "2026-04-14T07:50:00Z" },
  { id: "msg-2", conversationId: "conv-1", senderId: "user-1", content: "Ya, sudah update data properti", messageType: "text", createdAt: "2026-04-14T07:55:00Z" },
  { id: "msg-3", conversationId: "conv-1", senderId: "user-2", content: "Terima kasih infonya", messageType: "text", createdAt: "2026-04-14T08:00:00Z" },
];

export class ChatServiceMock implements IChatService {
  async getConversations(_params?: QueryParams): Promise<ApiResponse<Conversation[]>> {
    await delay(100);
    return { success: true, data: mockConversations, message: "OK" };
  }

  async createConversation(participantId: string): Promise<ApiResponse<Conversation>> {
    await delay(150);
    const conv: Conversation = {
      id: "conv-" + Date.now(),
      participantId,
      participantName: "New Contact",
      unreadCount: 0,
    };
    return { success: true, data: conv, message: "Created" };
  }

  async getMessages(conversationId: string, _params?: QueryParams): Promise<ApiResponse<ChatMessage[]>> {
    await delay(100);
    const msgs = mockMessages.filter((m) => m.conversationId === conversationId);
    return { success: true, data: msgs, message: "OK" };
  }

  async sendMessage(conversationId: string, content: string, messageType = "text"): Promise<ApiResponse<ChatMessage>> {
    await delay(120);
    const msg: ChatMessage = {
      id: "msg-" + Date.now(),
      conversationId,
      senderId: "current-user",
      content,
      messageType: messageType as ChatMessage["messageType"],
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: msg, message: "Sent" };
  }

  async markAsRead(_conversationId: string): Promise<void> {
    await delay(50);
  }
}
