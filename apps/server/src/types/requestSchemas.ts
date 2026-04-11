import z from "zod";
export const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string(),
});
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
export const createBoardSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});
export const updateBoardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
export const createColumnSchema = z.object({
  title: z.string().min(1, "Title is required"),
  boardId: z.string().min(1, "Board ID is required"),
});

export const updateColumnSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
export const createCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  columnId: z.string().min(1, "Column ID is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
});

export const updateCardSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  columnId: z.string().optional(),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;

export const addMemberSchema = z.object({
  email: z.email("Invalid email"),
  role: z.enum(["OWNER", "MEMBER"]).default("MEMBER"),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.enum(["RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "ORANGE", "PINK"]),
});
