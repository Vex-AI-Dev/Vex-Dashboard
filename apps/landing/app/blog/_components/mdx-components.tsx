import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

import { slugify } from '~/lib/blog';

function Heading2({ children }: { children?: React.ReactNode }) {
  const text =
    typeof children === 'string' ? children : String(children ?? '');
  const id = slugify(text);
  return (
    <h2 id={id} className="group relative">
      <a
        href={`#${id}`}
        className="absolute -left-5 top-0 hidden text-[#585858] opacity-0 transition-opacity group-hover:opacity-100 md:block"
        aria-hidden="true"
      >
        #
      </a>
      {children}
    </h2>
  );
}

function Heading3({ children }: { children?: React.ReactNode }) {
  const text =
    typeof children === 'string' ? children : String(children ?? '');
  const id = slugify(text);
  return (
    <h3 id={id}>
      {children}
    </h3>
  );
}

function MdxImage(props: React.ComponentProps<'img'>) {
  const { src, alt, width, height } = props;
  if (!src) return null;

  // External URLs or images without dimensions — use standard img with styling
  if (src.startsWith('http')) {
    return (
      <span className="my-6 block overflow-hidden rounded-lg border border-[#252525]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          className="w-full"
          loading="lazy"
        />
      </span>
    );
  }

  // Local images — use Next.js Image for optimization
  return (
    <span className="my-6 block overflow-hidden rounded-lg border border-[#252525]">
      <Image
        src={src}
        alt={alt ?? ''}
        width={Number(width) || 720}
        height={Number(height) || 400}
        className="w-full"
      />
    </span>
  );
}

function Callout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-relaxed text-[#a2a2a2]">
      {children}
    </div>
  );
}

function MdxBlockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote className="my-6 border-l-2 border-emerald-500/40 pl-4 italic text-[#a2a2a2]">
      {children}
    </blockquote>
  );
}

function MdxTable({ children }: { children?: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[#252525]">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function MdxTh({ children }: { children?: React.ReactNode }) {
  return (
    <th className="bg-[#161616] px-4 py-2 text-left font-medium text-white">
      {children}
    </th>
  );
}

function MdxTd({ children }: { children?: React.ReactNode }) {
  return (
    <td className="border-t border-[#252525] px-4 py-2 text-[#a2a2a2]">
      {children}
    </td>
  );
}

function MdxHr() {
  return <hr className="my-10 border-[#252525]" />;
}

export const mdxComponents: MDXComponents = {
  h2: Heading2,
  h3: Heading3,
  img: MdxImage,
  blockquote: MdxBlockquote,
  table: MdxTable,
  th: MdxTh,
  td: MdxTd,
  hr: MdxHr,
  Callout,
};
