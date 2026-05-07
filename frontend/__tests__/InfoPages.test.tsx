import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("lucide-react", () => ({
  Mail: () => <svg data-testid="mail-icon" />,
}));

import FAQPage from "@/app/(info)/faq/page";
import ContactPage from "@/app/(info)/contact/page";
import TermsPage from "@/app/(info)/terms/page";
import PrivacyPage from "@/app/(info)/privacy/page";

describe("Info Pages", () => {
  describe("FAQ Page", () => {
    it("renders the page heading", () => {
      render(<FAQPage />);
      expect(
        screen.getByRole("heading", { name: /자주 묻는 질문/ })
      ).toBeInTheDocument();
    });

    it("renders FAQ items", () => {
      render(<FAQPage />);
      const items = screen.getAllByRole("heading", { level: 2 });
      expect(items.length).toBeGreaterThanOrEqual(3);
    });

    it("renders a link back to home", () => {
      render(<FAQPage />);
      const homeLink = screen.getByText("← 홈으로");
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.closest("a")).toHaveAttribute("href", "/");
    });

    it("contains expected FAQ question text", () => {
      render(<FAQPage />);
      expect(
        screen.getByText(/Layer는 어떤 서비스인가요/)
      ).toBeInTheDocument();
    });
  });

  describe("Contact Page", () => {
    it("renders the page heading", () => {
      render(<ContactPage />);
      expect(
        screen.getByRole("heading", { level: 1, name: /문의하기/ })
      ).toBeInTheDocument();
    });

    it("renders the email address", () => {
      render(<ContactPage />);
      const emailElements = screen.getAllByText("support@layer.dev");
      expect(emailElements.length).toBeGreaterThanOrEqual(1);
    });

    it("renders a mailto link", () => {
      render(<ContactPage />);
      const mailLink = screen.getByRole("link", { name: /support@layer\.dev/ });
      expect(mailLink).toHaveAttribute("href", "mailto:support@layer.dev");
    });

    it("renders a link back to home", () => {
      render(<ContactPage />);
      const homeLink = screen.getByText("← 홈으로");
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("Terms Page", () => {
    it("renders the page heading", () => {
      render(<TermsPage />);
      expect(
        screen.getByRole("heading", { name: /이용약관/ })
      ).toBeInTheDocument();
    });

    it("renders terms sections", () => {
      render(<TermsPage />);
      const sections = screen.getAllByRole("heading", { level: 2 });
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });

    it("renders a link back to home", () => {
      render(<TermsPage />);
      const homeLink = screen.getByText("← 홈으로");
      expect(homeLink).toBeInTheDocument();
    });

    it("contains placeholder notice", () => {
      render(<TermsPage />);
      expect(screen.getByText(/placeholder/)).toBeInTheDocument();
    });
  });

  describe("Privacy Page", () => {
    it("renders the page heading", () => {
      render(<PrivacyPage />);
      expect(
        screen.getByRole("heading", { name: /개인정보처리방침/ })
      ).toBeInTheDocument();
    });

    it("renders privacy sections", () => {
      render(<PrivacyPage />);
      const sections = screen.getAllByRole("heading", { level: 2 });
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });

    it("renders a link back to home", () => {
      render(<PrivacyPage />);
      const homeLink = screen.getByText("← 홈으로");
      expect(homeLink).toBeInTheDocument();
    });

    it("contains placeholder notice", () => {
      render(<PrivacyPage />);
      expect(screen.getByText(/placeholder/)).toBeInTheDocument();
    });
  });
});