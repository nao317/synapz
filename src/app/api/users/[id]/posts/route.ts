// src/app/api/users/[id]/posts/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await context.params;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const posts = await prisma.post.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarurl: true,
                    },
                },
                likes: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error(`GET /api/users/[id]/posts error`, error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
