export interface Policy {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed';
    progress: number;
    image_url?: string;
}
