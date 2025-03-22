'use client';
import RandomStringWithReplacement from "@/components/random-string-replacer";
import AnimatedList from "@/components/ui/animated-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Spending } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { Dialog,  DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";



const sarcasmMap = [
    'Wow, you spent %amount% on that?',
    'I hope that %amount% was worth it.',
    'Really had nothing better to do with %amount%?',
    'I wish I had %amount%.',
    'That %amount% must have been burning a hole in your pocket.',
    'You must be thrilled to have parted with %amount%.',
    'I bet you can’t wait to spend more than %amount% next time.',
    'What a fantastic use of %amount%.',
    'I’m sure that %amount% will be remembered for years to come.',
    'You’re really living the dream with that %amount% spent.',
    'I hope the guilt of spending %amount% is worth it.',
    'That %amount% is definitely not going to be missed.',
    'You must have had a blast spending %amount%.',
    'I’m sure it was a tough decision to spend %amount%.',
    'That %amount% is clearly money well spent.',
    'I bet you’re already planning how to spend the next %amount%.'
];


const ItemListProps = {
    start_date: new Date(),
    end_date: new Date(),
}

export default function ItemList(
    props: typeof ItemListProps
) {
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
        setLoading(true);
        props.start_date.setHours(0, 0, 0, 1);
        props.end_date.setHours(23, 59, 59, 999);
        supabase.from("spent").select('*, category_id(*)')
            .gte('created_at', props.start_date.toISOString())
            .lte('created_at', props.end_date.toISOString())
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
            if (error) {
                console.error(error);
            } else {
                setSpending(data as Spending[]);
                setLoading(false);
            }
            console.log(data);
        });
    }, [props]);

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
                {
                    spending.length > 0 &&
                    <>
                    <RandomStringWithReplacement className="text-lg" templates={sarcasmMap} replacement={'$'+String(calculateTotal())} marker={'%amount%'} />
                    <AnimatedList items={spending} onItemClick={handleItemClick}/>
                    </>
                }
            </div>
            <Dialog open={selectedItem !== null} onOpenChange={(open) => {
                    if (!open) {
                        setSelectedItem(null);
                    }
                    }}>
                    <DialogContent className={'w-3/4'}>
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
                                <div className="text-center">
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
