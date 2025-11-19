export interface Milestone {
  id: string;
  date: Date;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MilestoneInput {
  date: Date;
  title: string;
  description?: string | null;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface MilestoneUpdate {
  date?: Date;
  title?: string;
  description?: string | null;
  imageUrl?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
}
