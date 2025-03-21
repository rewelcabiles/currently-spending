'use client'
import React, { Suspense } from 'react';
import { DatePicker } from './calendar-view';
import ItemListDate from './item-list-date';

export default function HistoryPage() {
    
    return (
        <div className="flex-1 w-full flex flex-col gap-6 ">
            <h1 className='w-full text-center text-lg font-semibold'>Looking back at your regrets huh?</h1>
            <Suspense >
                <DatePicker />
                <ItemListDate />
            </Suspense>
        </div>
    );
};
