import { Category } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";


class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient();
    }

    async getCategories()  {
        const {data, error} = await this.supabase.from('categories').select('*');
        if (error) {
            console.error(error);
        }
        return data || [];
    }

    async createCategory(category: string): Promise<Category> {
        const user = (await this.supabase.auth.getSession()).data.session?.user;
        if (!user) {
            throw new Error('User not found');
        }
        const {data, error} = await this.supabase.from('categories').insert({
            name: category,
            user_id: user.id
        }).select()
        if (error) {
            console.error(error);
        }
        return data ? data[0] : null;
    }

}

export const supabaseService = new SupabaseService();