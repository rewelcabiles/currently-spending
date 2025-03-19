'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Spending {
    id: number;
    created_at: string;
    item: string;
    price: number;
}

const sarcasmMap = [
    'Wow, you spent %amount% on that?',
    'I hope that %amount% was worth it.',
    'Really had nothing better to do with %amount%?',
    'I wish I had %amount%.',
]

export default function ItemList() {
    const supabase = createClient();
    const [spending, setSpending] = useState<Spending[]>([]);
    const [total, setTotal] = useState(0);
    const [sarcasm, setSarcasm] = useState('');
    
    const calculateTotal = () => {
        let total = 0;
        spending.forEach((item) => {
            total += item.price;
        });
        setTotal(total);
    }

    useEffect(() => {
        if (total === 0) {
            setSarcasm('You have not spent anything yet.');
        }
        const randomSarcasm = sarcasmMap[Math.floor(Math.random() * sarcasmMap.length)];
        setSarcasm(randomSarcasm.replace('%amount%', `$${total.toFixed(2)}`));
    }, [total]);

    useEffect(() => {
        const fetchSpending = async () => {
            const { data, error } = await supabase.from("spent").select();
            if (error) {
                console.error(error);
            } else {
                setSpending(data as Spending[]);
                calculateTotal();
            }
        };
        fetchSpending();
        const channel = supabase.channel("realtime spent").on('postgres_changes', {
            event: "INSERT", schema: "public", table: "spent"
        }, (payload) => {
            console.log(payload.new);
            setSpending([...spending, payload.new as Spending]);
            calculateTotal();
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase, setSpending, spending, sarcasmMap, calculateTotal]);

    return (
        <div className="flex-1 w-full flex flex-col gap-4">
            <h2 className="font-bold text-2xl">
                {sarcasm}
            </h2>
            {
                spending.length > 0 &&
                <pre className="text-xs font-mono p-3 rounded border overflow-auto">
                {
                    [...spending].reverse().map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 border-b">
                            <span className="text-gray-500">{new Date(item.created_at).toLocaleTimeString()}</span>
                            <span className="font-medium">{item.item}</span>
                            <span className="text-gray-500">${item.price.toFixed(2)}</span>
                        </div>
                    ))
                }
                </pre>
            }
        </div>
    );
}
