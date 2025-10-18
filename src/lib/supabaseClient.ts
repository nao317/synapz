// supabase 接続用のクライアント

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// クライアントサイドでのみSupabaseクライアントを作成
export const getSupabaseClient = () => {
    if (typeof window === 'undefined') {
        // サーバーサイドでは null を返す
        return null;
    }
    
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase環境変数が設定されていません');
        return null;
    }
    
    return createClient(supabaseUrl, supabaseAnonKey);
};

// 従来の使い方との互換性のため
export const supabase = getSupabaseClient();
