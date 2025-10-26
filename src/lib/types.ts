export type Like = {
    id: string;
    userId: string;
    postId: string;
    created_at: string;
};

export type Post = {
    id: string;
    content: string;
    image?: string | null;
    created_at: string;
    user: {
        id: string;
        name: string | null;
        avatarurl: string | null;
    };
    likes: Like[];
};
