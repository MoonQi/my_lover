'use client';

import { useState } from 'react';
import { Timeline } from '@/components/features/Timeline/Timeline';
import { UpcomingList } from '@/components/features/UpcomingAnniversaries/UpcomingList';
import { Modal } from '@/components/ui/Modal';
import { MilestoneForm } from '@/components/features/MilestoneForm';
import { useMilestones } from '@/hooks/useMilestones';
import { useTimeCalculation } from '@/hooks/useTimeCalculation';
import { Heart, Gift, Plus } from 'lucide-react';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { milestones, mutate } = useMilestones();

  // Get first milestone (earliest date) for "together since" calculation
  const firstMilestone = milestones && milestones.length > 0 ? milestones[milestones.length - 1] : null;
  const { totalTimeTogether } = useTimeCalculation(
    firstMilestone?.date || new Date(),
    !!firstMilestone
  );

  const handleAddMilestone = async (data: any) => {
    const response = await fetch('/api/milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        date: new Date(data.date).toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '创建失败');
    }

    await mutate();
    setIsAddModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-romantic-50 overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with "Together Since" */}
        <header className="mb-16 text-center animate-fade-in">
          {totalTimeTogether && (
            <div className="inline-flex flex-col items-center">
              <div className="relative">
                 {/* 脉冲光环 */}
                 <div className="absolute inset-0 animate-ping rounded-full bg-romantic-200 opacity-20 duration-3000"></div>
                 {/* 主体徽章 */}
                 <div className="relative inline-flex items-center gap-3 rounded-full bg-white/90 px-8 py-4 shadow-lg shadow-romantic-100 backdrop-blur-sm border border-romantic-100 hover:scale-105 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-romantic-500 fill-romantic-500 animate-pulse" />
                  <span className="text-xl font-medium text-gray-600">
                    我们已经相爱
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-romantic-600 to-pink-600 bg-clip-text text-transparent">
                    {totalTimeTogether}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-romantic-300 tracking-[0.2em] uppercase">
                And counting...
              </p>
            </div>
          )}
        </header>

        {/* Upcoming Anniversaries Section */}
        <section className="mb-16 relative" aria-labelledby="upcoming-heading">
          {/* 装饰背景 */}
          <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-romantic-100/30 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 pl-2 relative z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-romantic-500 shadow-sm border border-romantic-100">
              <Gift className="h-5 w-5" />
            </div>
            <h2
              id="upcoming-heading"
              className="text-2xl font-bold text-gray-800 tracking-tight"
            >
              即将到来的惊喜
            </h2>
          </div>
          <UpcomingList />
        </section>

        {/* Timeline Section */}
        <section aria-labelledby="timeline-heading">
          <Timeline />
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-10 right-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-romantic-500 to-pink-500 text-white shadow-xl shadow-romantic-300/40 transition-all duration-300 hover:scale-110 hover:rotate-90 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-romantic-200 active:scale-95 z-50"
        aria-label="添加里程碑"
      >
        <Plus className="h-8 w-8" />
      </button>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加里程碑"
      >
        <MilestoneForm
          onSubmit={handleAddMilestone}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
