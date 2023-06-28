import { z } from "zod";

export const MenuItemValidator = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  category: z.string(),
});

export type CreateMenuItemPayload = z.infer<typeof MenuItemValidator>;
