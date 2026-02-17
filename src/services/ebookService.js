import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const EbookService = {
    /**
     * Upload ebook file to Supabase Storage
     */
    async uploadFile(userId, file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('flipbook')
            .upload(filePath, file);

        if (error) throw error;
        return data.path;
    },

    /**
     * Save ebook metadata to Database
     */
    async createEbook(ebookData) {
        const { data, error } = await supabase
            .from('ebooks')
            .insert([
                {
                    title: ebookData.title,
                    file_path: ebookData.filePath,
                    pages: ebookData.pages || [], // Array of storage paths
                    user_id: ebookData.userId,
                    type: ebookData.type, // 'pdf' or 'images'
                    is_public: true
                }
            ])
            .select()
            .single();


        if (error) throw error;
        return data;
    },

    /**
     * Fetch ebook details by ID
     */
    async getEbookById(id) {
        const { data, error } = await supabase
            .from('ebooks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Generate Public URL for a file
     */
    getPublicUrl(filePath) {
        const { data } = supabase.storage
            .from('flipbook')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
