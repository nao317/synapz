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
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const form = await request.formData();
        const name = form.get('name')?.toString() ?? '';
        const profile = form.get('profile')?.toString() ?? '';
        const avatarBase64 = form.get('avatar')?.toString() ?? null;

        let avatar_url: string | undefined;

        if (avatarBase64 && avatarBase64.startsWith('data:image/')) {
            const base64Data = avatarBase64.split(',')[1];
            const sizeInBytes = (base64Data.length * 3) / 4;

            if (sizeInBytes > 500_000) {
                return NextResponse.json({ error: 'Image too large (max 500KB)' }, { status: 400 });
            }

            avatar_url = avatarBase64;

        }

        const updated = await prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                name: name || null,
                profile: profile || null,
                email: user.email ?? '',
                ...(avatarBase64 ? { avatarurl: avatarBase64 } : {}),
            },
            update: {
                name: name || null,
                profile: profile || null,
                ...(avatarBase64 ? { avatarurl: avatarBase64 } : {}),
            },
            select: {
                id: true,
                email: true,
                name: true,
                profile: true,
                avatarurl: true, // Prismaスキーマと一致
            },
        });
        return NextResponse.json({
            name: updated.name ?? '',
            profile: updated.profile ?? '',
            avatar_url: updated.avatarurl ?? '',
            email: user.email ?? '',
        });
    } catch (error) {
        console.error('POST /api/users/[id] error', error);
        return NextResponse.json({ error: 'Failed to update the user data' }, { status: 500 });
    }
}
