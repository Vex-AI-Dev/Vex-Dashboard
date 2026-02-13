'use client';

import { useCaptureException } from '@kit/monitoring/hooks';

import { ErrorPageContent } from '~/components/error-page-content';
import { RootProviders } from '~/components/root-providers';

const GlobalErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useCaptureException(error);

  return (
    <html lang="en">
      <body>
        <RootProviders>
          <GlobalErrorContent reset={reset} />
        </RootProviders>
      </body>
    </html>
  );
};

function GlobalErrorContent({ reset }: { reset: () => void }) {
  return (
    <div className={'flex h-screen flex-1 flex-col'}>
      <ErrorPageContent
        statusCode={'common:errorPageHeading'}
        heading={'common:genericError'}
        subtitle={'common:genericErrorSubHeading'}
        backLabel={'common:goBack'}
        reset={reset}
      />
    </div>
  );
}

export default GlobalErrorPage;
