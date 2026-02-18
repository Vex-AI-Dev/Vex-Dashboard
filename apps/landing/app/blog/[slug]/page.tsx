import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getAllPosts, getPostBySlug } from '~/lib/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Vex Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Vex',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vex',
      url: 'https://tryvex.dev',
    },
  };

  return (
    <div className="container py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-[720px]">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <time className="text-sm text-[#585858]">{post.date}</time>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-[#a2a2a2]">{post.description}</p>
        </div>

        <div className="prose prose-invert max-w-none text-[#a2a2a2] prose-headings:text-white prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-[#a2a2a2] prose-li:text-[#a2a2a2] prose-strong:text-white prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-code:text-emerald-400 prose-code:bg-[#161616] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#161616] prose-pre:border prose-pre:border-[#252525]">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
