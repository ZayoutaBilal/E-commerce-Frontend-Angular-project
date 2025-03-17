
export interface ProductComment {
  userRatingId: number;
  userId: number;
  userName: string;
  comment: string;
  stars?: number;
  createdAt: Date;
  updatedAt?: Date;
  isApproved?: boolean;
  isReported?: boolean;
}
