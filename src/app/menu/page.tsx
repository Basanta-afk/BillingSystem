import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

const Menu = async () => {
  const session = await getAuthSession();

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const menu = await db.menuItem.findMany();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {menu.map((menuItem) => (
        <div key={menuItem.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-bold mb-2">{menuItem.name}</h3>
          <p className="mb-2">{menuItem.description}</p>
          <p className="text-gray-600">Price: {menuItem.price}</p>
          <p className="text-gray-600">Category: {menuItem.category}</p>
        </div>
      ))}
    </div>
  );
};

export default Menu;
