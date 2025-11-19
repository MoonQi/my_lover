'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useMilestones } from '@/hooks/useMilestones';
import { MilestoneCard } from './MilestoneCard';
import { TimelineEmpty } from './TimelineEmpty';
import { LoadingSkeleton } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { MilestoneForm } from '@/components/features/MilestoneForm';
import type { Milestone } from '@/types/milestone';

export function Timeline() {
  const { milestones, isLoading, isError, mutate } = useMilestones();
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (data: any) => {
    if (!editingMilestone) return;

    const response = await fetch(`/api/milestones/${editingMilestone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        date: new Date(data.date).toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '更新失败');
    }

    await mutate();
    setEditingMilestone(null);
  };

  const handleDelete = async () => {
    if (!deletingMilestone) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/milestones/${deletingMilestone.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '删除失败');
      }

      await mutate();
      setDeletingMilestone(null);
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : '删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-800">加载失败，请刷新页面重试</p>
        </div>
      </div>
    );
  }

  if (!milestones || milestones.length === 0) {
    return <TimelineEmpty />;
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Timeline header */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute -left-8 -top-2 animate-bounce delay-100">
                 <Heart className="h-6 w-6 rotate-[-15deg] text-romantic-300 fill-romantic-200" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                我们的<span className="text-romantic-500">纪念日</span>
              </h1>
              <div className="absolute -right-8 -bottom-2 animate-bounce delay-300">
                 <Heart className="h-5 w-5 rotate-[15deg] text-romantic-400 fill-romantic-300" />
              </div>
            </div>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 font-light italic">
            "记录我们相爱的每一个瞬间，让美好永存"
          </p>
        </header>

        {/* Timeline items */}
        <div className="space-y-8" role="list" aria-label="纪念日时间轴">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} role="listitem">
              <MilestoneCard
                milestone={milestone}
                isFirst={index === 0}
                onEdit={() => setEditingMilestone(milestone)}
                onDelete={() => setDeletingMilestone(milestone)}
              />
            </div>
          ))}
        </div>

        {/* Timeline footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          共 {milestones.length} 个珍贵回忆
        </footer>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingMilestone}
        onClose={() => setEditingMilestone(null)}
        title="编辑里程碑"
      >
        {editingMilestone && (
          <MilestoneForm
            milestone={editingMilestone}
            onSubmit={handleEdit}
            onCancel={() => setEditingMilestone(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingMilestone}
        onClose={() => setDeletingMilestone(null)}
        title="确认删除"
      >
        {deletingMilestone && (
          <div className="space-y-4">
            <p className="text-gray-700">
              确定要删除「{deletingMilestone.title}」吗？此操作无法撤销。
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-full bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
              <button
                onClick={() => setDeletingMilestone(null)}
                disabled={isDeleting}
                className="flex-1 rounded-full bg-gray-200 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
