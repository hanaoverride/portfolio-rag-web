"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Bookmark,
  LogOut,
  UserCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Content } from "@/lib/api/types";
import { getCategories } from "@/lib/api/categories";
import { getContents } from "@/lib/api/contents";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useAuth } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { NotificationList } from "../common/NotificationList";

interface HeaderProps {
  categories?: Category[];
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: Category) => void;
  className?: string;
}

export function Header({
  categories: propCategories = [],
  onSearch,
  onCategorySelect,
  className,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>(propCategories);
  const categoriesFetched = useRef(false);
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (isAuthenticated) {
        try {
          const { notificationsApi } = await import("@/lib/api/notifications");
          const data = await notificationsApi.list();
          setNotificationCount(data.length);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };
    fetchNotificationCount();

    window.addEventListener('notificationsUpdated', fetchNotificationCount);
    return () => window.removeEventListener('notificationsUpdated', fetchNotificationCount);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (propCategories.length === 0 && !categoriesFetched.current) {
      categoriesFetched.current = true;
      getCategories()
        .then(setCategories)
        .catch((err) => console.error("Failed to fetch categories:", err));
    } else if (propCategories.length > 0) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-lg border-b border-[var(--glass-border)]"
          : "bg-[var(--color-bg-surface)]/80 backdrop-blur-md border-b border-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Category */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-1">
            <Image
              src="/logo.png"
              alt="Layer"
              width={100}
              height={32}
              className="h-8 w-auto transition-opacity duration-200 group-hover:opacity-80"
              priority
            />
          </Link>

          {categories.length > 0 && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-primary-50/60 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                >
                  카테고리
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={8}
                  className="z-50 min-w-[200px] rounded-2xl glass p-2 animate-scale-in"
                >
                  {categories.map((cat) => (
                    <DropdownMenu.Item
                      key={cat.id}
                      className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 outline-none"
                      onSelect={() => onCategorySelect?.(cat)}
                    >
                      {cat.name}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/trending"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-primary-50/60 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
            >
              인기
            </Link>
            <Link
              href="/new"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-primary-50/60 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
            >
              최신
            </Link>
            <Link
              href="/contents"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-primary-50/60 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
            >
              콘텐츠 둘러보기
            </Link>
            <Link
              href="/youtubers"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-primary-50/60 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
            >
              유튜버 목록
            </Link>
          </nav>
        </div>

        {/* Center: Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex relative items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-page)]/60 px-4 py-2 transition-all duration-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/20 focus-within:bg-[var(--color-bg-surface)]"
        >
          <Search className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              const query = e.target.value.trim();

              if (debounceRef.current) clearTimeout(debounceRef.current);

              if (!query) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
              }

              debounceRef.current = setTimeout(async () => {
                try {
                  const result = await getContents({ search: query, limit: 5 });
                  setSearchResults(result.items);
                  setShowDropdown(true);
                } catch {
                  setSearchResults([]);
                  setShowDropdown(false);
                }
              }, 300);
            }}
            placeholder="콘텐츠 검색..."
            className="w-48 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none lg:w-72"
          />
          {showDropdown && searchResults.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl glass overflow-hidden animate-fade-in-up"
            >
              {searchResults.map((result, idx) => (
                <button
                  key={result.id}
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-primary-50/60 dark:hover:bg-primary-900/20 transition-colors duration-200 border-b border-[var(--color-border-subtle)] last:border-0"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => {
                    router.push(`/content/${result.id}`);
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="font-medium truncate">{result.title}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{result.author.name}</div>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-1">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-9 w-9" />
          ) : (
            isAuthenticated && (
              <DropdownMenu.Root onOpenChange={setIsNotificationsOpen}>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-primary)]"
                    aria-label="알림"
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    {notificationCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-[var(--color-bg-surface)]" />
                    )}
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 p-0 rounded-2xl glass overflow-hidden animate-scale-in"
                  >
                    <NotificationList key={isNotificationsOpen ? 'open' : 'closed'} />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )
          )}

          {isLoading ? (
            <div className="h-9 w-9" />
          ) : !isAuthenticated ? (
            <Link
              href="/login"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
            >
              로그인
            </Link>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-primary)] ring-1 ring-[var(--color-border)] hover:ring-primary-300 dark:hover:ring-primary-600"
                  aria-label="사용자 메뉴"
                >
                  <User className="h-[18px] w-[18px]" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="z-50 min-w-[180px] rounded-2xl glass p-2 animate-scale-in"
                >
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/profile"
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/30 outline-none"
                    >
                      <UserCircle className="h-4 w-4" />
                      내 프로필
                    </Link>
                  </DropdownMenu.Item>
                  {user?.role === 'admin' && (
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/admin"
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/30 outline-none"
                      >
                        <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        관리자 패널
                      </Link>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/bookmark"
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/30 outline-none"
                    >
                      <Bookmark className="h-4 w-4" />
                      북마크
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1.5 h-px bg-[var(--color-border)]" />
                  <DropdownMenu.Item
                    onSelect={async () => {
                      await logout();
                      router.push('/');
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-error transition-all duration-200 hover:bg-error-light/60 dark:hover:bg-error/10 outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-bg-page)]"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="glass border-t border-[var(--color-border)] px-4 pb-5 pt-3 md:hidden animate-fade-in-up">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)]/60 px-4 py-2.5">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const query = e.target.value.trim();

                  if (debounceRef.current) clearTimeout(debounceRef.current);

                  if (!query) {
                    setSearchResults([]);
                    setShowDropdown(false);
                    return;
                  }

                  debounceRef.current = setTimeout(async () => {
                    try {
                      const result = await getContents({ search: query, limit: 5 });
                      setSearchResults(result.items);
                      setShowDropdown(true);
                    } catch {
                      setSearchResults([]);
                      setShowDropdown(false);
                    }
                  }, 300);
                }}
                placeholder="콘텐츠 검색..."
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
            </div>
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl glass overflow-hidden">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm text-[var(--color-text-primary)] hover:bg-primary-50/60 dark:hover:bg-primary-900/20 border-b border-[var(--color-border-subtle)] last:border-0 transition-colors"
                    onClick={() => {
                      router.push(`/content/${result.id}`);
                      setShowDropdown(false);
                      setSearchQuery("");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="font-medium truncate">{result.title}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{result.author.name}</div>
                  </button>
                ))}
              </div>
            )}
          </form>

          {categories.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">카테고리</p>
              <nav className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="rounded-full px-4 py-1.5 text-sm text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/20 border border-[var(--color-border)]"
                    onClick={() => {
                      onCategorySelect?.(cat);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            </div>
          )}

          <div className="mb-6 space-y-1">
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">탐색</p>
            <Link
              href="/trending"
              className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-primary-50/60 dark:hover:bg-primary-900/20 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              인기
            </Link>
            <Link
              href="/new"
              className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-primary-50/60 dark:hover:bg-primary-900/20 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              최신
            </Link>
            <Link
              href="/contents"
              className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-primary-50/60 dark:hover:bg-primary-900/20 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              콘텐츠 둘러보기
            </Link>
            <Link
              href="/youtubers"
              className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-primary-50/60 dark:hover:bg-primary-900/20 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              유튜버 목록
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-9 w-9" />
            ) : (
              isAuthenticated && (
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)]"
                  aria-label="알림"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-[var(--color-bg-surface)]" />
                </button>
              )
            )}
            {isLoading ? (
              <div className="h-9 w-9" />
            ) : !isAuthenticated ? (
              <Link
                href="/login"
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200 hover:bg-primary-500"
              >
                로그인
              </Link>
            ) : (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] ring-1 ring-[var(--color-border)]"
                    aria-label="사용자 메뉴"
                  >
                    <User className="h-[18px] w-[18px]" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 min-w-[180px] rounded-2xl glass p-2 animate-scale-in"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/profile"
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/30 outline-none"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        내 프로필
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/bookmark"
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-all duration-200 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-primary-900/30 outline-none"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Bookmark className="h-4 w-4" />
                        북마크
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1.5 h-px bg-[var(--color-border)]" />
                    <DropdownMenu.Item
                      onSelect={async () => {
                        await logout();
                        router.push('/');
                      }}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-error transition-all duration-200 hover:bg-error-light/60 dark:hover:bg-error/10 outline-none"
                    >
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        </div>
      )}
    </header>
  );
}