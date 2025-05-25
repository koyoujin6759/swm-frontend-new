'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { StudyRoomErrorFallback } from '@/components/error-boundary/study-room/study-room-error-fallback';
import { StudyRoomErrorBoundary } from '@/components/error-boundary/study-room/study-room-errorboundary';
import { StudyRoomLoading } from '@/components/loading/study-room-loading';

const StudyRoomCreateContainer = dynamic(
  () =>
    import('@/components/study-room/container').then(
      (mod) => mod.StudyRoomCreateContainer,
    ),
  {
    ssr: false,
    loading: () => <StudyRoomLoading />,
  },
);

export default function StudyRoomNew() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <StudyRoomErrorBoundary
          onReset={reset}
          FallbackComponent={StudyRoomErrorFallback}
        >
          <Suspense fallback={<StudyRoomLoading />}>
            <StudyRoomCreateContainer />
          </Suspense>
        </StudyRoomErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
