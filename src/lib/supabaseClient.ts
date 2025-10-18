// supabase 接続用のクライアント

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// シングルトンパターン: クライアントインスタンスをキャッシュ
let cachedSupabaseClient: SupabaseClient | null = null;

/**
 * Supabaseクライアントを取得する（シングルトンパターン）
 * 一度作成されたクライアントインスタンスは再利用される
 * @returns SupabaseClient instance or null if server-side or missing env vars
 */
export const getSupabaseClient = (): SupabaseClient | null => {
    // サーバーサイドレンダリング中は null を返す
    if (typeof window === 'undefined') {
        return null;
    }
    
    // 既にクライアントが作成されている場合はそれを返す
    if (cachedSupabaseClient) {
        return cachedSupabaseClient;
    }
    
    // 環境変数のチェック
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase環境変数が設定されていません');
        console.error('必要な環境変数: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
        return null;
    }
    
    try {
        // 新しいクライアントインスタンスを作成してキャッシュ
        cachedSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        console.log('Supabaseクライアントが初期化されました');
        return cachedSupabaseClient;
    } catch (error) {
        console.error('Supabaseクライアントの初期化に失敗しました:', error);
        return null;
    }
};

/**
 * キャッシュされたクライアントインスタンスをクリアする
 * 主にテスト用途や再初期化が必要な場合に使用
 */
export const clearSupabaseClientCache = (): void => {
    cachedSupabaseClient = null;
};

// 従来の使い方との互換性のため（ただし、サーバーサイドでは null になる）
export const supabase = getSupabaseClient();
