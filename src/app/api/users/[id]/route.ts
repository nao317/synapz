import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies: () => cookies() });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                name: true,
                profile: true,
                email: true,
                avatarurl: true,
            },
        });

        if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({
            name: dbUser.name ?? '',
            profile: dbUser.profile ?? '',
            email: dbUser.email ?? '',
            avatar_url: dbUser.avatarurl ?? '',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const form = await request.formData();
        const name = form.get('name')?.toString() ?? '';
        const profile = form.get('profile')?.toString() ?? '';
        const avatar_url = form.get('avatar_url')?.toString() ?? null;

        const updated = await prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                name: name || null,
                profile: profile || null,
                email: user.email ?? '',
                ...(avatar_url ? { avatarurl: avatar_url } : {}),
            },
            update: {
                name: name || null,
                profile: profile || null,
                ...(avatar_url ? { avatarurl: avatar_url } : {}),
            },
            select: {
                id: true,
                name: true,
                profile: true,
                email: true,
                avatarurl: true,
            },
        });

        return NextResponse.json({
            user: {
                id: updated.id,
                name: updated.name ?? '',
                profile: updated.profile ?? '',
                email: updated.email ?? '',
                avatar_url: updated.avatarurl ?? '',
            },
        });
    } catch (error) {
        console.error('POST /api/users/[id] error', error);
        return NextResponse.json({ error: 'Failed to update the user data' }, { status: 500 });
    }
}
