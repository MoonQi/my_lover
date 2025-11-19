export function TimelineEmpty() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">💝</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">还没有纪念日</h2>
      <p className="mb-6 max-w-md text-gray-600">
        开始记录你们的美好时光吧！每一个重要的时刻都值得珍藏。
      </p>
      <button className="rounded-full bg-romantic-600 px-6 py-3 font-medium text-white shadow-md hover:bg-romantic-700 transition-colors">
        添加第一个纪念日
      </button>
    </div>
  );
}
