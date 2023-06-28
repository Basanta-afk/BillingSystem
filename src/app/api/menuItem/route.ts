import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MenuItemValidator } from "@/lib/validators/menuItem";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, category, price, image } =
      MenuItemValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.menuItem.create({
      data: {
        name,
        description,
        category,
        price,
        image,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}

