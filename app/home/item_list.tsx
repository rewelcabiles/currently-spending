'use client';
import RandomStringWithReplacement from "@/components/random-string-replacer";
import AnimatedList from "@/components/ui/animated-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Spending } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { Dialog,  DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { Button } from "@/components/ui/button";



const sarcasmMap = [
    'Wow, you spent %amount% on that?',
    'I hope that %amount% was worth it.',
    'Really had nothing better to do with %amount%?',
    'I wish I had %amount%.',
]

export default function ItemList() {
    const supabase = createClient();
    const [spending, setSpending] = useState<Spending[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Spending | null>(null);
    
    const calculateTotal = () => {
        let total = 0;
        spending.forEach((item) => {
            total += item.price;
        });
        return total;
    }

    useEffect(() => {
        const todayStartDate = new Date();
        todayStartDate.setHours(0, 0, 0, 1);
        supabase.from("spent").select().gte('created_at', todayStartDate.toISOString()).order('created_at', { ascending: false }).then(({ data, error }) => {
            if (error) {
                console.error(error);
            } else {
                setSpending(data as Spending[]);
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {

        const channel = supabase.channel("realtime spent").on('postgres_changes', {
            event: "INSERT", schema: "public", table: "spent"
        }, (payload) => {
            setSpending([payload.new as Spending, ...spending ]);
            console.log("New item added");
        }).subscribe();
        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase, spending, setSpending]);

    if (loading) {
        return (
            <div className="flex-1 w-full flex flex-col gap-4">
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-[96] h-[20px] rounded-full" />
            </div>
        )
    }

    const handleItemClick = (item: Spending) => {
        setSelectedItem(item);
    }

    return (
        <>
            <div className="flex-1 w-full flex flex-col gap-4">
                <RandomStringWithReplacement className="font-bold text-2xl text-wrap" templates={sarcasmMap} replacement={'$'+String(calculateTotal())} marker={'%amount%'} />
                {
                    spending.length > 0 &&
                    <AnimatedList items={spending} onItemClick={handleItemClick}/>
                }
            </div>
            <Dialog open={selectedItem !== null} onOpenChange={(open) => {
                    if (!open) {
                        setSelectedItem(null);
                    }
                    }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <div className="text-xl font-semibold text-white">
                                    {selectedItem?.item}
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                    {
                                    new Date(selectedItem?.created_at as string).toLocaleString()
                                    } 
                            </DialogDescription>
                        </DialogHeader>
                            <div className="flex flex-col gap-8">
                                <div>
                                {
                                    new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(Number(selectedItem?.price))
                                }
                                </div>
                                <Button size={'sm'} onClick={() => {
                                    supabase.from("spent").delete().eq('id', selectedItem?.id).then(({ data, error }) => {
                                        if (error) {
                                            console.error(error);
                                        } else {
                                            setSpending(spending.filter((item) => item.id !== selectedItem?.id));
                                            setSelectedItem(null);
                                        }
                                    });
                                }}>
                                    Delete
                                </Button>
                            </div>
                    </DialogContent>
                </Dialog>
        </>
    );
}
