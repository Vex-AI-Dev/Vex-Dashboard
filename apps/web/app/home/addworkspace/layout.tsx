import { Toaster } from '@kit/ui/sonner';

export default function AddWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      {children}
      <Toaster />
    </div>
  );
}
