import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent Health Score — Free Assessment Tool',
  description:
    "Score your AI agent's production readiness in 2 minutes. Get personalized recommendations for monitoring, safety, testing, and operations.",
  keywords: [
    'AI agent production readiness',
    'AI agent monitoring checklist',
    'AI agent health check',
    'LLM production readiness',
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
