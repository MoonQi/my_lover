import { z } from 'zod';

// Helper to validate URL or relative path, with max length constraint
const urlOrPath = z
  .string()
  .max(500, '图片链接不能超过500个字符')
  .refine(
    (val) => {
      if (!val) return true; // Empty is valid (will be handled by optional)
      // Allow absolute URLs or relative paths starting with /
      return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/');
    },
    { message: '图片链接无效' }
  );

// Milestone validation schema for creation
export const milestoneSchema = z.object({
  date: z.coerce.date({
    required_error: '日期是必填项',
    invalid_type_error: '请输入有效的日期',
  }),
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(200, '标题不能超过200个字符')
    .trim(),
  description: z
    .string()
    .max(2000, '描述不能超过2000个字符')
    .optional()
    .transform((val) => (val === '' ? null : val)),
  // 前端表单会在"无图片"时提交空字符串，这里预处理为空则视为未提供
  imageUrl: z
    .preprocess(
      (val) => (val === '' ? undefined : val),
      urlOrPath
    )
    .optional(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
});

// Milestone update schema (all fields optional for partial updates)
export const milestoneUpdateSchema = z.object({
  date: z.coerce.date().optional(),
  title: z.string().min(1).max(200).trim().optional(),
  description: z
    .string()
    .max(2000)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  // 更新时，空字符串表示"清除图片"，因此预处理为 null
  imageUrl: z
    .preprocess(
      (val) => (val === '' ? null : val),
      urlOrPath.nullable()
    )
    .optional(),
  imageWidth: z.number().int().positive().optional().nullable(),
  imageHeight: z.number().int().positive().optional().nullable(),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type MilestoneUpdate = z.infer<typeof milestoneUpdateSchema>;
