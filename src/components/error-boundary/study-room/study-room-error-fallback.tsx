import { StudyRoomErrorFallbackProps } from './study-room-errorboundary';

export function StudyRoomErrorFallback({ error, resetErrorBoundary }: StudyRoomErrorFallbackProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">스터디룸 정보를 불러오는데 실패했습니다.</h2>
      <pre className="text-red-500 mb-4">{error?.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        다시 시도하기
      </button>
    </div>
  );
} 