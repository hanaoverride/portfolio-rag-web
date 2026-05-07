"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { noticesApi, notificationsApi, CreateNoticeRequest, CreateNotificationRequest } from '@/lib/api';
import { useToast } from '@/lib/hooks/useToast';
import { 
  LayoutDashboard, 
  Bell, 
  FileText, 
  Send, 
  PlusCircle, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'notification' | 'notice'>('notification');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [notifData, setNotifData] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    userId: undefined
  });
  
  const [noticeData, setNoticeData] = useState<CreateNoticeRequest>({
    title: '',
    content: '',
    isImportant: false
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      showToast('접근 권한이 없습니다.', 'error');
      router.push('/');
    }
  }, [user, authLoading, router, showToast]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifData.title || !notifData.message) return;
    
    setIsSubmitting(true);
    try {
      await notificationsApi.create(notifData);
      showToast('알림이 성공적으로 전송되었습니다.', 'success');
      setNotifData({ title: '', message: '', userId: undefined });
    } catch (error) {
      showToast('알림 전송에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeData.title || !noticeData.content) return;
    
    setIsSubmitting(true);
    try {
      await noticesApi.create(noticeData);
      showToast('공지사항이 등록되었습니다.', 'success');
      setNoticeData({ title: '', content: '', isImportant: false });
    } catch (error) {
      showToast('공지사항 등록에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0a0a0c] text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              관리자 패널
            </h1>
            <p className="text-white/50">사이트 관리 및 소통을 위한 도구입니다.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('notification')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              activeTab === 'notification' 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">알림 발송</span>
          </button>
          <button
            onClick={() => setActiveTab('notice')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
              activeTab === 'notice' 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">공지사항 작성</span>
          </button>
        </div>

        {/* Forms Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {activeTab === 'notification' ? (
            <form onSubmit={handleSendNotification} className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Send className="w-5 h-5" />
                <h2 className="text-xl font-semibold text-white">시스템 알림 전송</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">알림 제목</label>
                  <input
                    type="text"
                    value={notifData.title}
                    onChange={(e) => setNotifData({ ...notifData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder-white/20"
                    placeholder="알림 제목을 입력하세요"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">대상 사용자 ID (비워두면 전체 발송)</label>
                  <input
                    type="number"
                    value={notifData.userId || ''}
                    onChange={(e) => setNotifData({ ...notifData, userId: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder-white/20"
                    placeholder="사용자 ID (예: 1)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">알림 내용</label>
                  <textarea
                    value={notifData.message}
                    onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder-white/20 resize-none"
                    placeholder="알림 내용을 입력하세요"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    알림 보내기
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateNotice} className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <PlusCircle className="w-5 h-5" />
                <h2 className="text-xl font-semibold text-white">새 공지사항 등록</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">공지 제목</label>
                  <input
                    type="text"
                    value={noticeData.title}
                    onChange={(e) => setNoticeData({ ...noticeData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder-white/20"
                    placeholder="공지 제목을 입력하세요"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={noticeData.isImportant}
                    onChange={(e) => setNoticeData({ ...noticeData, isImportant: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500/50"
                  />
                  <label htmlFor="isImportant" className="flex items-center gap-2 text-sm font-medium text-white/90 cursor-pointer">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    중요 공지로 표시
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">공지 내용</label>
                  <textarea
                    value={noticeData.content}
                    onChange={(e) => setNoticeData({ ...noticeData, content: e.target.value })}
                    rows={10}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder-white/20 resize-none"
                    placeholder="공지 상세 내용을 입력하세요 (Markdown 지원 가능)"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    공지사항 등록
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
