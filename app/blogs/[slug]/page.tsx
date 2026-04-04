import Image from 'next/image';
import { fetchAPI, getStrapiURL } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getBlog(slug: string) {
  const res = await fetchAPI(
    `/api/blogs?filters[slug][$eq]=${slug}&populate=*`
  );

  return res.data?.[0] || null;
}

export async function generateMetadata({ params }: any) {
  const blog = await getBlog(params.slug);

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.excerpt,
  };
}

// ✅ IMPROVED RICH TEXT (already safe)
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

  const image =
    blog.image?.formats?.large?.url ||
    blog.image?.formats?.medium?.url ||
    blog.image?.url;

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-4xl font-bold mb-6">
        {blog.title || "Untitled"}
      </h1>

      {/* ✅ FIX 3: SAFE IMAGE FALLBACK */}
      <div className="relative w-full h-[400px] mb-6">
        <Image
          src={image ? getStrapiURL(image) : "/fallback.jpg"}
          alt={blog.title || "Blog Image"}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <p className="text-gray-500 mb-6">
        {blog.author || "Admin"} •{" "}
        {blog.date
          ? new Date(blog.date).toDateString()
          : "No date"}
      </p>

      <div className="text-lg leading-relaxed">
        {renderContent(blog.content)}
      </div>
    </main>
  );
}