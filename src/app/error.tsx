'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">出错了</h2>
        <p className="mb-6 text-gray-600">抱歉，发生了意外错误。</p>
        <button
          onClick={reset}
          className="rounded-md bg-romantic-600 px-4 py-2 text-white hover:bg-romantic-700"
        >
          重试
        </button>
      </div>
    </div>
  );
}
