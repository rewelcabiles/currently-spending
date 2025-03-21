import NewSpentForm from "./new_item";
import ItemList from "../../components/ui/item_list";

export default async function ProtectedPage() {

  return (
    <div className="flex-1 w-full flex flex-col gap-6 ">
      <NewSpentForm />
      <hr className="my-4"/>
      <ItemList start_date={new Date()} end_date={new Date()}  />
    </div>
  );
}
