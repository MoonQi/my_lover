'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { DatePicker } from '@/components/ui/DatePicker';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Milestone } from '@/types/milestone';

// Form validation schema
const milestoneFormSchema = z.object({
  date: z.string().min(1, '日期是必填项'),
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200个字符').trim(),
  description: z.string().max(2000, '描述不能超过2000个字符').trim().optional(),
  imageUrl: z.string().optional(),
  imageWidth: z.number().optional(),
  imageHeight: z.number().optional(),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

interface MilestoneFormProps {
  milestone?: Milestone;
  onSubmit: (data: MilestoneFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MilestoneForm({
  milestone,
  onSubmit,
  onCancel,
  isLoading = false,
}: MilestoneFormProps) {
  const isEditing = !!milestone;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: milestone
      ? {
          date: new Date(milestone.date).toISOString().split('T')[0],
          title: milestone.title,
          description: milestone.description || '',
          imageUrl: milestone.imageUrl || '',
          imageWidth: milestone.imageWidth || undefined,
          imageHeight: milestone.imageHeight || undefined,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          imageUrl: '',
          imageWidth: undefined,
          imageHeight: undefined,
        },
  });

  const imageUrl = watch('imageUrl');

  const handleImageChange = (url: string, width: number, height: number) => {
    setValue('imageUrl', url, { shouldValidate: true });
    setValue('imageWidth', width || undefined);
    setValue('imageHeight', height || undefined);
  };

  const onFormSubmit = async (data: MilestoneFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <DatePicker
        label="日期"
        error={errors.date?.message}
        required
        disabled={isLoading || isSubmitting}
        {...register('date')}
      />

      <Input
        label="标题"
        placeholder="例如：我们在一起的第一天"
        error={errors.title?.message}
        required
        disabled={isLoading || isSubmitting}
        {...register('title')}
      />

      <Textarea
        label="描述"
        placeholder="记录这个特殊时刻的故事..."
        rows={4}
        error={errors.description?.message}
        disabled={isLoading || isSubmitting}
        {...register('description')}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          图片（可选）
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={handleImageChange}
          disabled={isLoading || isSubmitting}
          onError={(error) => console.error('Image upload error:', error)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="default"
          isLoading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
          className="flex-1"
        >
          {isEditing ? '保存更改' : '创建里程碑'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading || isSubmitting}
          className="flex-1"
        >
          取消
        </Button>
      </div>
    </form>
  );
}
