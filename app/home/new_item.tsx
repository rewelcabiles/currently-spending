'use client';
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/app/home/category-selector";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
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
        (document.getElementById("new_item") as HTMLInputElement).value = '';
        (document.getElementById("new_price") as HTMLInputElement).value = '';
        setIsAdding(false);
      };
    return (
        <>
            <div className="w-full">
                <h2 className="font-bold text-xl sm:text-2xl ">What have you spent on Today?</h2>
                <Input className="border-2" autoFocus type="text" name="new_item" id="new_item" />
            </div>
            <div className="w-full">
                <h2 className="font-bold text-xl sm:text-2xl ">How much was it?</h2>
                <Input className="border-2" type="number" name="new_price" id="new_price" />
            </div>
            <CategorySelector />
            
            <Button
                disabled={isAdding}
                onClick={handleAddSpending}
            >
                {isAdding ? <Spinner size='sm'/> : "I wasted money on this"}
            </Button>
        </>
    )
}