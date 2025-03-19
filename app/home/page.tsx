import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewSpentForm from "./new_item";
import ItemList from "./item_list";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: spending } = await supabase.from("spent").select();

  if (!user) {
    return redirect("/sign-in");
  }


  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <NewSpentForm />
      <ItemList />
    </div>
  );
}
