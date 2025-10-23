// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // ✅ awaitしてidを取り出す
        const { id } = await context.params;

        const supabase = createRouteHandlerClient({ cookies });
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // 認証チェック
        if (!user || user.id !== id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // DBから該当ユーザーを取得
        const dbUser = await prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                profile: true,
                email: true,
                avatarurl: true,
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 正常レスポンス
        return NextResponse.json({
            name: dbUser.name ?? '',
            profile: dbUser.profile ?? '',
            email: dbUser.email ?? '',
            avatar_url: dbUser.avatarurl ?? '',
        });
    } catch (error) {
        console.error('GET /api/users/[id] error', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        // ✅ cookies を await して渡す
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user || user.id !== params.id)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const form = await req.formData();
        const name = form.get("name")?.toString() ?? "";
        const profile = form.get("profile")?.toString() ?? "";
        const avatar_url = form.get("avatar_url")?.toString() ?? null;

        // ✅ キャッシュバスターを付与
        const avatarUrlWithCacheBuster = avatar_url ? `${avatar_url}?t=${Date.now()}` : null;

        const updated = await prisma.user.upsert({
            where: { id: params.id },
            create: {
                id: params.id,
                name: name || null,
                profile: profile || null,
                email: user.email ?? "",
                ...(avatarUrlWithCacheBuster ? { avatarurl: avatarUrlWithCacheBuster } : {}),
            },
            update: {
                name: name || null,
                profile: profile || null,
                ...(avatarUrlWithCacheBuster ? { avatarurl: avatarUrlWithCacheBuster } : {}),
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
                name: updated.name ?? "",
                profile: updated.profile ?? "",
                email: updated.email ?? "",
                avatar_url: updated.avatarurl ?? "",
            },
        });
    } catch (error) {
        console.error("POST /api/users/[id] error", error);
        return NextResponse.json({ error: "Failed to update the user data" }, { status: 500 });
    }
}