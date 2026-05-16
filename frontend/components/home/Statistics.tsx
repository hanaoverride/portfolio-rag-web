"use client";

import { useEffect, useState } from "react";

import { getStatistics } from "@/lib/api/statistics";
import { StatisticsResponse } from "@/lib/api/types";
import { Bookmark, MessageSquare, BarChart3, PlaySquare, Eye, Users } from "lucide-react";

export const Statistics = () => {
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="animate-pulse bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 h-48 border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center h-full gap-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-20 flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">플랫폼 활동 통계</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            사용자들이 함께 만들어가는 지식 공유 생태계의 현재 모습입니다. 더 많은 지식을 탐험하고 나누어보세요.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 w-full xl:w-auto">
          <div className="group text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-3 mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/10 group-hover:border-blue-500/50">
              <PlaySquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
              {stats.totalContents.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">콘텐츠</div>
          </div>

          <div className="group text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-3 mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/10 group-hover:border-emerald-500/50">
              <Eye className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">조회수</div>
          </div>

          <div className="group text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-3 mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-orange-500/10 group-hover:border-orange-500/50">
              <Users className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
              {stats.totalYoutubers.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">유튜버</div>
          </div>

          <div className="group text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-3 mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/10 group-hover:border-indigo-500/50">
              <Bookmark className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
              {stats.totalBookmarks.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">북마크</div>
          </div>

          <div className="group text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-3 mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/10 group-hover:border-purple-500/50">
              <MessageSquare className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
              {stats.totalComments.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">댓글</div>
          </div>
        </div>
      </div>
    </section>
  );
};
