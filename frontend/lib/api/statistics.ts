import { apiClient } from "./client";
import { StatisticsResponse } from "./types";

/**
 * Get site-wide statistics
 */
export async function getStatistics(): Promise<StatisticsResponse> {
  return apiClient.get<StatisticsResponse>("/statistics");
}

/**
 * Get current user statistics
 */
export async function getMyStatistics(): Promise<StatisticsResponse> {
  return apiClient.get<StatisticsResponse>("/statistics/me");
}
