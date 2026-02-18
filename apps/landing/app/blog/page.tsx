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

  return (
    <div className="container py-24">
      <div className="mb-4 text-[13px] font-medium uppercase tracking-widest text-emerald-500">
        Blog
      </div>
      <h1 className="mb-12 text-3xl font-bold text-white sm:text-4xl">
        Insights & Guides
      </h1>

      {posts.length === 0 ? (
        <p className="text-[#a2a2a2]">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-[#252525] bg-[#0a0a0a] p-6 transition-colors hover:border-[#585858] hover:bg-[#161616]"
            >
              <div className="mb-3 flex items-center gap-2">
                <time className="text-xs text-[#585858]">{post.date}</time>
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
    </div>
  );
}
