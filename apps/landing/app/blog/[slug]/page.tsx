import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getAllPosts, getPostBySlug } from '~/lib/blog';

import { AuthorByline } from '../_components/author-byline';
import { mdxComponents } from '../_components/mdx-components';
import { PostCta } from '../_components/post-cta';
import { ReadingProgressBar } from '../_components/reading-progress-bar';
import { ShareOnX } from '../_components/share-button';
import { TableOfContents } from '../_components/table-of-contents';

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
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vex',
      url: 'https://tryvex.dev',
    },
    timeRequired: `PT${post.readingTime}M`,
  };

  return (
    <>
      <ReadingProgressBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-24">
        <article className="mx-auto max-w-[720px]">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#585858] transition-colors hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 4l-4 4 4 4" />
            </svg>
            Back to Blog
          </Link>

          {/* Post header */}
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <time className="text-sm text-[#585858]">{post.date}</time>
              <span className="text-[#585858]">&middot;</span>
              <span className="font-mono text-sm text-[#585858]">
                {post.readingTime} min read
              </span>
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
          </header>

          {/* Table of contents */}
          <TableOfContents headings={post.headings} />

          {/* Article body */}
          <div className="prose prose-invert max-w-none text-[#a2a2a2] prose-headings:text-white prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-[#a2a2a2] prose-li:text-[#a2a2a2] prose-strong:text-white prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-code:text-emerald-400 prose-code:bg-[#161616] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#161616] prose-pre:border prose-pre:border-[#252525]">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Post footer: author + share */}
          <AuthorByline
            author={post.author}
            date={post.date}
            readingTime={post.readingTime}
          />

          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/blog"
              className="text-sm text-[#585858] transition-colors hover:text-white"
            >
              &larr; All posts
            </Link>
            <ShareOnX title={post.title} slug={post.slug} />
          </div>

          {/* Post CTA */}
          <PostCta />
        </article>
      </div>
    </>
  );
}
