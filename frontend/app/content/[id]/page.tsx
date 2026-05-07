import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContent } from "@/lib/api/contents";
import { ContentDetailClient } from "./ContentDetailClient";

interface ContentDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  try {
    const content = await getContent(params.id);
    return {
      title: `${content.title} — Layer`,
      description: content.description,
    };
  } catch {
    return { title: "Layer" };
  }
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  let content;
  try {
    content = await getContent(params.id);
  } catch {
    notFound();
  }

  return <ContentDetailClient content={content} />;
}