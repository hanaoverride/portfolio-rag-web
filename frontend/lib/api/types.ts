// Auto-generated TypeScript types matching OpenAPI specification

export interface Author {
  name: string;
  avatar: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  emoji?: string;
  level: number;
  timestamp?: number;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string[];
  author: Author;
  duration: number;
  views: number;
  createdAt: string;
  tableOfContents: TableOfContentsItem[];
  bodyContent: string;
  relatedContents: string[];
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface YouTuber {
  id: string;
  name: string;
  avatar: string;
  channelUrl: string;
  subscribers: number;
  description: string;
  categories: string[];
  contentCount: number;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface PaginatedContentsResponse {
  items: Content[];
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedYouTubersResponse {
  items: YouTuber[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  isAdmin: boolean;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresAt?: string;
  user?: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
}

export interface PasswordResetInitResponse {
  message: string;
  debugToken?: string;
}

export interface BookmarkRequest {
  contentId: string;
}

export interface BookmarkedContent {
  content: Content;
  bookmarkedAt: string;
}

export interface PaginatedBookmarksResponse {
  items: BookmarkedContent[];
  total: number;
  limit: number;
  offset: number;
}

export interface CommentRequest {
  text: string;
}

export interface CommentResponse {
  id: number;
  contentId: string;
  userId: number;
  text: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCommentsResponse {
  items: CommentResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface StructuredChatContent {
  type: string;
  content: string;
  source?: string;
}

export interface ChatMessagePayload {
  role: "system" | "user" | "assistant";
  content: string | StructuredChatContent;
}

export interface ChatMetadataFilter {
  channelName: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessagePayload[];
  temperature?: number;
  user?: string;
  metadataFilter?: ChatMetadataFilter;
  useRag?: boolean;
}

export interface AssistantMessagePayload {
  role: "assistant";
  content: StructuredChatContent;
}

export interface ChatChoice {
  index: number;
  message: AssistantMessagePayload;
  finishReason: "stop";
}

export interface UsageMetrics {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  choices: ChatChoice[];
  usage?: UsageMetrics;
}

export interface ExportResponse {
  categories: Category[];
  contents: Content[];
  youtubers: YouTuber[];
}

// API Functions
export interface ListContentsParams {
  category?: string;
  search?: string;
  isNew?: boolean;
  sortBy?: 'views' | 'created_at';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ListYouTubersParams {
  category?: string;
  limit?: number;
  offset?: number;
}

export interface ListBookmarksParams {
  limit?: number;
  offset?: number;
}

export interface ListCommentsParams {
  limit?: number;
  offset?: number;
}

export interface GetCategoryContentsParams {
  limit?: number;
  offset?: number;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  authorName: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  isImportant?: boolean;
}

export interface PaginatedNoticesResponse {
  items: Notice[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListNoticesParams {
  limit: number;
  offset: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: number;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  userId?: number;
}

export interface StatisticsResponse {
  totalBookmarks: number;
  totalComments: number;
  totalContents: number;
  totalViews: number;
  totalYoutubers: number;
}



