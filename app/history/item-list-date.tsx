'use client';
import ItemList from "@/components/ui/item_list";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemListDate() {
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    console.log("Starting");
    console.log(dateParam);

    useEffect(() => {
        if (dateParam) {
            setStartDate(new Date(dateParam));
            setEndDate(new Date(dateParam));
        }
        console.log('date changed');
    }, [dateParam]);

    return (
        <ItemList start_date={startDate} end_date={endDate} />
    )
}