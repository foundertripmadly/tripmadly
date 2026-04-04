import Image from 'next/image';
import { fetchAPI } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

async function getBlog(slug: string) {
  const res = await fetchAPI(
    `/blogs?filters[slug][$eq]=${slug}&populate=*`
  );

  return res?.data?.[0] || null;
}

export async function generateMetadata({ params }: any) {
  const blog = await getBlog(params.slug);
  if (!blog) return {};

  const attr = blog.attributes || blog;

  return {
    title: attr.title,
    description: attr.excerpt,
  };
}

function renderContent(content: any) {
  if (!content) return null;

  return content.map((block: any, i: number) => {
    const text = block.children?.map((c: any) => c.text).join("") || "";

    switch (block.type) {
      case "paragraph":
        return <p key={i} className="mb-4">{text}</p>;

      case "heading":
        return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{text}</h2>;

      case "list":
        return (
          <ul key={i} className="list-disc ml-6 mb-4">
            {block.children.map((item: any, j: number) => (
              <li key={j}>
                {item.children?.map((c: any) => c.text).join("")}
              </li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  });
}

export default async function BlogDetail({ params }: any) {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  const attr = blog.attributes || blog;

  const imagePath =
    attr.image?.formats?.large?.url ||
    attr.image?.formats?.medium?.url ||
    attr.image?.url;

  const image = imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-4xl font-bold mb-6">
        {attr.title || "Untitled"}
      </h1>

      <div className="relative w-full h-[400px] mb-6 overflow-hidden rounded-xl">
        <Image
          src={image || "/fallback.jpg"}
          alt={attr.title || "Blog Image"}
          fill
          className="object-cover"
        />
      </div>

      <p className="text-gray-500 mb-6">
        {attr.author || "Admin"} •{" "}
        {attr.date
          ? new Date(attr.date).toDateString()
          : "No date"}
      </p>

      <div className="text-lg leading-relaxed">
        {renderContent(attr.content)}
      </div>
    </main>
  );
}