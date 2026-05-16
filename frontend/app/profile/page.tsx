"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, User, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { FormattedDate } from "@/components/common/FormattedDate";
import { useAuth } from "@/lib/hooks";
import { getMyStatistics } from "@/lib/api/statistics";
import { StatisticsResponse } from "@/lib/api/types";
import { Bookmark, MessageSquare, BarChart3 } from "lucide-react";


export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const data = await getMyStatistics();
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch user statistics:", error);
        } finally {
          setStatsLoading(false);
        }
      } else if (!authLoading) {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [user, authLoading]);

  const isLoading = authLoading || (user && statsLoading);

  if (isLoading) {
    return (
      <>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-page)] mb-5">
              <User className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              로그인이 필요합니다
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              프로필을 보려면 먼저 로그인해 주세요.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-display section-title-decoration">
          프로필
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          내 계정 정보
        </p>

        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 sm:p-8 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 dark:from-primary-900/30 dark:to-primary-900/20 dark:text-primary-400">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-[var(--color-text-muted)]">
                  표시 이름
                </dt>
                <dd className="mt-1 text-base font-semibold text-[var(--color-text-primary)]" data-testid="profile-display-name">
                  {user.displayName}
                </dd>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)]" />

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 dark:from-primary-900/30 dark:to-primary-900/20 dark:text-primary-400">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-[var(--color-text-muted)]">
                  이메일
                </dt>
                <dd className="mt-1 text-base text-[var(--color-text-primary)]" data-testid="profile-email">
                  {user.email}
                </dd>
              </div>
            </div>

            {user.createdAt && (
              <>
                <div className="border-t border-[var(--color-border)]" />

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 dark:from-primary-900/30 dark:to-primary-900/20 dark:text-primary-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <dt className="text-sm font-medium text-[var(--color-text-muted)]">
                      가입일
                    </dt>
                    <dd className="mt-1 text-base text-[var(--color-text-primary)]" data-testid="profile-created-at">
                      <FormattedDate date={user.createdAt} />
                    </dd>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              내 활동 통계
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-subtle)] transition-all hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Bookmark className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">북마크</dt>
                <dd className="text-2xl font-black text-[var(--color-text-primary)]">
                  {stats?.totalBookmarks.toLocaleString() ?? 0}
                </dd>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border-subtle)] transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">댓글</dt>
                <dd className="text-2xl font-black text-[var(--color-text-primary)]">
                  {stats?.totalComments.toLocaleString() ?? 0}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}