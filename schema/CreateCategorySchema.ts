import z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});
