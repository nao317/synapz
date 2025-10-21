// users/[id]/route.ts
// ここではUserテーブルのAPI設計、CRUD処理を記述する

// server処理用
import { NextResponse } from 'next/server';

// Cookie管理
import { cookies } from 'next/headers';

// prisma
import { prisma } from '@/lib/prisma';

// npm install @supabase/auth-helpers-nextjs
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Http GET Req
export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { name: true }
        });

        return NextResponse.json({ user: dbUser });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch user data'}, { status: 500 });
    }
}
