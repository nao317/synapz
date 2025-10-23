// api/Auth/login
// signup用のAPI設計

// サーバー処理用
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// RouteHandlerClient
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    // Component/Route Handlerでsupabaseを使うための文言
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // 認証エラーが起きた場合
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: 'You Logged In' }, { status: 200 });
}
