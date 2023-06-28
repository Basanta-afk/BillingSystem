import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MenuItemValidator } from "@/lib/validators/menuItem"; // Update the path accordingly
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getAuthSession(); // Implement the getAuthSession function accordingly

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const menuItemData = MenuItemValidator.parse(req.body);

    // Example: Create a new MenuItem
    const createdMenuItem = await db.menuItem.create({
      data: {
        ...menuItemData,
      },
    });

    return res.status(200).json(createdMenuItem);
  } catch (error) {
    return res.status(400).json({ message: "Invalid data", error });
  }
}
