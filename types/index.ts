export interface Policy {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed';
    progress: number;
    image_url?: string;
}

export interface Member {
    id: number;
    name: string;
    nickname: string;
    role: string;
    quote?: string;
    instagram?: string;
    image_url?: string;
    order?: number;
}
