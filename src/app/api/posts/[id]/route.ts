// src/app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

function createSupabaseClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async get(name: string) {
                    const store = await cookieStore;
                    return store.get(name)?.value
                },
                async set(name: string, value: string, options: CookieOptions) {
                    const store = await cookieStore;
                    store.set({ name, value, ...options })
                },
                async remove(name: string, options: CookieOptions) {
                    const store = await cookieStore;
                    store.set({ name, value: '', ...options })
                },
            }
        }
    );

}

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarurl: true,
                    }
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('GET /api/posts/[id] error', error);
        return NextResponse.json(
            { error: 'Failed to fetch post data' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id: postId } = await context.params;
    try {
        const supabase = createSupabaseClient();

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const form = await req.formData();
        const content = form.get("content")?.toString();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const updated = await prisma.post.update({
            where: { id: postId },
            data: {
                content: content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarurl: true,
                    },
                },
            },
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error('PATCH /api/posts/[id] error', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id: postId } = await context.params;

    try {
        const supabase = createSupabaseClient();

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        if (error || !user) {
            return NextResponse.json({ error: "Unauthorized " }, { status: 401 });
        }
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (post.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/posts/[id] error', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    return PATCH(req, context);
}