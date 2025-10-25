// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

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
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { avatarurl, ...rest } = dbUser;

        return NextResponse.json({ ...rest, avatar_url: avatarurl });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await context.params;
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user || user.id !== userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const name = form.get("name")?.toString() ?? "";
    const profile = form.get("profile")?.toString() ?? "";
    const avatar_url = form.get("avatar_url")?.toString() ?? null;

    const avatarUrlWithCacheBuster = avatar_url
      ? `${avatar_url}?t=${Date.now()}`
      : null;

    const updated = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        name: name || null,
        profile: profile || null,
        email: user.email ?? "",
        ...(avatarUrlWithCacheBuster
          ? { avatarurl: avatarUrlWithCacheBuster }
          : {}),
      },
      update: {
        name: name || null,
        profile: profile || null,
        ...(avatarUrlWithCacheBuster
          ? { avatarurl: avatarUrlWithCacheBuster }
          : {}),
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
    return NextResponse.json(
      { error: "Failed to update the user data" },
      { status: 500 }
    );
  }
}
