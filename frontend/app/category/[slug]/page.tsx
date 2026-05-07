import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/lib/api/categories";
import CategoryPageClient from "./CategoryPageClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const cat = await getCategory(params.slug);
    return {
      title: `${cat.name} — Layer`,
      description: `${cat.name} 카테고리의 콘텐츠`,
    };
  } catch {
    return { title: "Layer" };
  }
}

export default async function CategoryPage({ params }: Props) {
  let category;
  try {
    category = await getCategory(params.slug);
  } catch {
    notFound();
  }
  return <CategoryPageClient slug={params.slug} categoryName={category.name} />;
}
