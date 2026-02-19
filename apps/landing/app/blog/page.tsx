import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllPosts } from '~/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Vex',
  description:
    'Insights on AI agent monitoring, runtime reliability, drift detection, and production guardrails.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="container py-24">
      {/* Hero */}
      <div className="mb-16 border-b border-[#252525] pb-12">
        <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
          Blog
        </div>
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Insights &amp; Guides
        </h1>
        <p className="max-w-[520px] text-[17px] leading-relaxed text-[#a2a2a2]">
          Deep dives on AI agent reliability, drift detection, hallucination
          correction, and production guardrails. Written by the Vex team.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[#a2a2a2]">No posts yet. Check back soon.</p>
      ) : (
        <>
          {/* Featured post — full width */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-12 block rounded-xl border border-[#252525] bg-[#0a0a0a] p-8 transition-colors hover:border-emerald-500/30 hover:bg-[#161616] sm:p-10"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest text-emerald-500">
                  Latest
                </span>
                <time className="text-xs text-[#585858]">{featured.date}</time>
                <span className="font-mono text-xs text-[#585858]">
                  {featured.readingTime} min read
                </span>
                {featured.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-emerald-400 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="max-w-[640px] text-base leading-relaxed text-[#a2a2a2]">
                {featured.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500 transition-colors group-hover:text-emerald-400">
                Read article
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
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
            </Link>
          )}

          {/* Remaining posts — grid */}
          {rest.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-[#252525] bg-[#0a0a0a] p-6 transition-colors hover:border-[#585858] hover:bg-[#161616]"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <time className="text-xs text-[#585858]">{post.date}</time>
                    <span className="font-mono text-xs text-[#585858]">
                      {post.readingTime} min read
                    </span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mb-2 text-lg font-semibold text-white group-hover:text-emerald-400">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#a2a2a2]">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
