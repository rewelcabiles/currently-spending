'use client';
import RandomStringWithReplacement from "@/components/random-string-replacer";
import AnimatedList from "@/components/ui/animated-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Category, Spending } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { Dialog,  DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./input";
import { Label } from "./label";
import { CategorySelector } from "./category-selector";
import { format, formatDistance, formatRelative, subDays } from 'date-fns' 
import LoadingSpinner from "./spinner";
import { supabaseService } from "@/services/supabase";


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
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    
    const calculateTotal = () => {
        let total = 0;
        spending.forEach((item) => {
            total += item.price;
        });
        return total;
    }

    const handleCategorySelect = (new_category_id: number | null) => {
        if (selectedItem === null) {
            return;
        }
        setSelectedItem({...selectedItem, category_id: new_category_id});
    }

    const handleSaveChanges = () => {
        setIsSaving(true);
        console.log(selectedItem);
        supabase.from("spent").update({
            item: selectedItem?.item,
            price: selectedItem?.price,
            created_at: new Date(selectedItem?.created_at as string).toISOString(),
            category_id: selectedItem?.category_id
        }).eq('id', selectedItem?.id).select('*')
        .then(({ data, error }) => {
            console.log(data);
            if (error) {
                console.error(error);
            } else {
                const index = spending.findIndex((item) => item.id === selectedItem?.id);
                spending[index] = data[0] as Spending;
                setSelectedItem(null);
            }
            setIsSaving(false);
        });
    }

    useEffect(() => {
        supabaseService.getCategories().then((data) => {
            setCategories(data);
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        props.start_date.setHours(0, 0, 0, 1);
        props.end_date.setHours(23, 59, 59, 999);
        supabase.from("spent").select('*')
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
                    <AnimatedList items={spending} onItemClick={handleItemClick} categories={categories} />
                    </>
                }
            </div>
            {
                selectedItem !== null &&
                <Dialog open={selectedItem !== null} onOpenChange={(open) => {
                        if (!open) {
                            setSelectedItem(null);
                        }
                        }}>
                        <DialogContent className={'w-3/4'}>
                            <DialogHeader>
                                <DialogTitle>
                                    Edit Item
                                </DialogTitle>
                                <DialogDescription>
                                        Make changes to the item or delete it.
                                </DialogDescription>
                            </DialogHeader>
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <Label className="text-sm">Name</Label>
                                            <Input type="text" className="input" value={selectedItem?.item} onChange={(e) => {
                                                    setSelectedItem({...selectedItem, item: e.target.value});
                                                }} 
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Amount</Label>
                                            <Input type="number" className="input" value={selectedItem?.price} onChange={(e) => {
                                                    setSelectedItem({...selectedItem, price: parseFloat(e.target.value)});   
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="datetime" className="text-right">
                                                Date & Time
                                            </Label>
                                                <Input
                                                id="datetime"
                                                name="datetime"
                                                type="datetime-local"
                                                value={
                                                    format(new Date(selectedItem?.created_at as string), 'yyyy-MM-dd\'T\'HH:mm')
                                                }
                                                onChange={(e) => {
                                                    setSelectedItem({...selectedItem, created_at: e.target.value});
                                                }}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Category</Label>
                                            <CategorySelector
                                                initialSelected={selectedItem?.category_id}
                                                onSelectionChange={(category_id: number | null) => {
                                                    handleCategorySelect(category_id);
                                                }}
                                                categories={categories} 
                                                />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4" >
                                        <Button variant={'default'} size={'sm'} onClick={() => {handleSaveChanges();}}>
                                            {
                                                isSaving ? 
                                                    <LoadingSpinner size="sm" />
                                                 : 'Save'
                                            }
                                        </Button>
                                        <Button variant={'destructive'} size={'sm'} onClick={() => {
                                            supabase.from("spent").delete().eq('id', selectedItem?.id)
                                            .then(({ data, error }) => {
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
                                </div>
                        </DialogContent>
                    </Dialog>
                }
        </>
    );
}
