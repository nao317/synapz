//src/app/api/post/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

// 投稿一覧を取得
export async function GET() {
    try {

        const dbPost = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarurl: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        return NextResponse.json(dbPost, { status: 200 });
    }
    catch (error) {
        console.error('GET /api/posts error', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// 投稿新規作成
export async function POST(req: Request) {
    try {
        const cookieStore = cookies()

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
        } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { content } = await req.json()

        if (!content) {
            return NextResponse.json({ error: 'Missing content' }, { status: 400 })
        }

        const newPost = await prisma.post.create({
            data: {
                content,
                userId: user.id,
            },
        })
        return NextResponse.json(newPost, { status: 201 })
    } catch (error) {
        console.error('POST /api/post error', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}