// supabaseClient のテスト用ファイル

import { getSupabaseClient, clearSupabaseClientCache } from './supabaseClient';

/**
 * Supabaseクライアントのシングルトン動作をテストする関数
 * ブラウザのコンソールで実行可能
 */
export const testSupabaseClientSingleton = () => {
    console.log('=== Supabaseクライアントシングルトン動作テスト ===');
    
    // キャッシュをクリア
    clearSupabaseClientCache();
    console.log('1. キャッシュをクリアしました');
    
    // 1回目の取得
    const client1 = getSupabaseClient();
    console.log('2. 1回目のクライアント取得:', client1 ? '成功' : '失敗');
    
    // 2回目の取得（同じインスタンスが返されるべき）
    const client2 = getSupabaseClient();
    console.log('3. 2回目のクライアント取得:', client2 ? '成功' : '失敗');
    
    // 同じインスタンスかチェック
    const isSameInstance = client1 === client2;
    console.log('4. 同じインスタンスか:', isSameInstance ? 'YES（正常）' : 'NO（異常）');
    
    // パフォーマンステスト
    console.time('クライアント取得パフォーマンス');
    for (let i = 0; i < 1000; i++) {
        getSupabaseClient();
    }
    console.timeEnd('クライアント取得パフォーマンス');
    
    console.log('=== テスト完了 ===');
    
    return {
        client1,
        client2,
        isSameInstance,
        performanceTestCompleted: true
    };
};

/**
 * 環境変数の状態をチェックする関数
 */
export const checkEnvironmentVariables = () => {
    console.log('=== 環境変数チェック ===');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定');
    console.log('========================');
};