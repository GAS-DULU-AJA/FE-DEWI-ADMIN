import type { ApiResponse, PaginatedResponse, QueryParams } from "./types";
import { apiClient } from "./api-client";

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: "text" | "image" | "file";
  createdAt: string;
}

export interface IChatService {
  getConversations(params?: QueryParams): Promise<ApiResponse<Conversation[]>>;
  createConversation(participantId: string): Promise<ApiResponse<Conversation>>;
  getMessages(conversationId: string, params?: QueryParams): Promise<ApiResponse<ChatMessage[]>>;
  sendMessage(conversationId: string, content: string, messageType?: string): Promise<ApiResponse<ChatMessage>>;
  markAsRead(conversationId: string): Promise<void>;
}

export class ChatService implements IChatService {
  async getConversations(params?: QueryParams): Promise<ApiResponse<Conversation[]>> {
    return apiClient<ApiResponse<Conversation[]>>("/chat/conversations", { params });
  }

  async createConversation(participantId: string): Promise<ApiResponse<Conversation>> {
    return apiClient<ApiResponse<Conversation>>("/chat/conversations", {
      method: "POST",
      body: { participantId },
    });
  }

  async getMessages(conversationId: string, params?: QueryParams): Promise<ApiResponse<ChatMessage[]>> {
    return apiClient<ApiResponse<ChatMessage[]>>(`/chat/conversations/${conversationId}/messages`, { params });
  }

  async sendMessage(conversationId: string, content: string, messageType = "text"): Promise<ApiResponse<ChatMessage>> {
    return apiClient<ApiResponse<ChatMessage>>(`/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: { content, messageType },
    });
  }

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient(`/chat/conversations/${conversationId}/read`, { method: "PATCH" });
  }
}
