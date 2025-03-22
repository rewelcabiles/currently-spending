export interface Spending {
    id: number;
    created_at: string;
    item: string;
    price: number;
    category_id: number | null;
}

export interface Category {
    id: number;
    created_at: string;
    name: string;
    is_default: boolean;
    user_id: string;
    parent_id: number | null;
}