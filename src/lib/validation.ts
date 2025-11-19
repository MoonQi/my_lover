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
  // 前端表单在“无图片”时会提交空字符串或不提交该字段
  // 这里允许：
  // - 未提供（undefined）
  // - 空字符串（会被转换为 undefined）
  // - 合法的 URL 或以 / 开头的相对路径
  imageUrl: urlOrPath
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
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
  // 更新时：
  // - 未提供（undefined）：不更新该字段
  // - 空字符串：视为“清除图片”，转换为 null
  // - null：保留为 null
  // - 其他字符串：必须是合法 URL 或以 / 开头的相对路径
  imageUrl: urlOrPath
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)),
  imageWidth: z.number().int().positive().optional().nullable(),
  imageHeight: z.number().int().positive().optional().nullable(),
});

export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type MilestoneUpdate = z.infer<typeof milestoneUpdateSchema>;
