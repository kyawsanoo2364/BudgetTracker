import { z } from "zod";

export const CreateTransactionSchema = z.object({
  description: z.string().optional(),
  date: z.coerce.date(),
  amount: z.coerce.number().min(0.1),
  category: z.string(),
  categoryIcon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});
