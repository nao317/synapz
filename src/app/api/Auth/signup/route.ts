// signup用のAPI設計

// server処理用
import { NextResponse } from 'next/server';

// prisma
import { prisma } from '@/lib/prisma';

// supabase用クライアント
import { supabase } from '@/lib/supabase'

export async function POST (request: Request) {
    // name, email, password
    const { name, email, password } = await request.json();

    // Authentification on Supabase
    const { data: auth_data, error: auth_error } = await supabase.auth.signUp({
        email,
        password,
    });

    // Authentificationの過程でエラーがあれば即座に処理を中断、エラーを返す
    if (auth_error || !auth_data.user) {
        // 400 : Bad Request
        return NextResponse.json({ error: auth_error?.message || 'Authentification failed' }, { status: 400 });
    }

    // public.Userにも情報を保存（Authentificationで得た分のデータと行を追加）
    try {
        // Supabase AuthのIDと連携させる（PrimaryKey）
        const user = await prisma.user.create({
            data: {
                id: auth_data.user.id,
                email: email,
                name: name,
            },
        });

        return NextResponse.json({ user }, { status: 201 });
    } catch (dbError) {
        // Prisma or DB error
        console.error(dbError);
        return NextResponse.json({ error: 'Failed to create user in database' }, { status: 500 });
    }
}
