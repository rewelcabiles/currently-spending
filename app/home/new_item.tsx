'use client';
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function NewSpentForm() {
    const supabase = createClient();
    const [isAdding, setIsAdding] = useState(false);
    

    const handleAddSpending = async () => {
        setIsAdding(true);
        const new_item = (document.getElementById("new_item") as HTMLInputElement).value;
        const new_price = (document.getElementById("new_price") as HTMLInputElement).value;

        if (!new_item || !new_price) {
            setIsAdding(false);
            alert("Please fill in both fields.");
            return;
        }
        const { data, error } = await supabase.from("spent").insert([
            { item: new_item, price: new_price },
        ]);
        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
        setIsAdding(false);
      };
    return (
        <>
            <div className="w-full">
                <h2 className="font-bold text-2xl mb-4">What have you spent on Today?</h2>
                <input autoFocus  className="p-2 w-full rounded-md" type="text" name="new_item" id="new_item" />
            </div>
            <div className="w-full">
                <h2 className="font-bold text-2xl mb-4">How much was it?</h2>
                <input className="p-2 w-full rounded-md" type="number" name="new_price" id="new_price" />
            </div>
            <button
                disabled={isAdding}
                onClick={handleAddSpending}
                className="bg-primary text-black p-2 rounded-md hover:bg-black hover:text-white transition-all duration-150"
            >
                {isAdding ? "Adding.." : "This is what I wasted money on"}
            </button>
        </>
    )
}