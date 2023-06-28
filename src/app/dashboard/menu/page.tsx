"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { MenuItemValidator } from "@/lib/validators/menuItem";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/Textarea";

type FormData = z.infer<typeof MenuItemValidator>;

const AddMenuItemForm = () => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(MenuItemValidator),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      image: "",
    },
  });

  const queryClient = new QueryClient(); // Create a new instance of QueryClient

  const { mutate: createMenuItem, isLoading } = useMutation({
    mutationFn: async ({
      name,
      description,
      category,
      price,
      image,
    }: FormData) => {
      const payload: FormData = { name, description, category, price, image };

      const { data } = await axios.post("/api/menuItem", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create menu item.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      });
      router.push("/menu"); // Redirect to the menu page after successful creation
    },
  });

  return (
    <div>
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit((e) => createMenuItem(e))}>
        <div>
          <label htmlFor="name">Name</label>
          <Input id="name" {...register("name")} />
          {errors?.name && (
            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <Textarea id="description" {...register("description")} />
          {errors?.description && (
            <p className="px-1 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <Input type="number" id="price" {...register("price", { valueAsNumber: true })} />
          {errors?.price && (
            <p className="px-1 text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <Input id="category" {...register("category")} />
          {errors?.category && (
            <p className="px-1 text-xs text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="image">Image URL</label>
          <Input id="image" {...register("image")} />
          {errors?.image && (
            <p className="px-1 text-xs text-red-600">{errors.image.message}</p>
          )}
        </div>
        <Button isLoading={isLoading}>Add</Button>
      </form>
    </div>
  );
};

// export default AddMenuItemForm;

const AddMenuItemPage = () => (
  <QueryClientProvider client={new QueryClient()}>
    <AddMenuItemForm />
  </QueryClientProvider>
);

export default AddMenuItemPage;
