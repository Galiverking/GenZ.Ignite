export interface Policy {
    id: string; // uuid in DB, or number depending on new/old
    title: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed';
    progress: number;
    description: string | null;
    image_url: string | null;
    last_updated?: string;
    votes?: number; // Fetched from relational count/sum if needed
}

export interface Complaint {
    id: number;
    created_at: string;
    topic: string;
    category: string;
    message: string;
    contact: string | null;
    status: 'pending' | 'resolved';
    track_id: string | null; // For users to track their complaint
    admin_reply: string | null; // Admin's response
    resolved_at: string | null; // When it was resolved
}

export interface Announcement {
    id: string; // uuid
    title: string;
    content: string;
    category: 'ข่าวด่วน' | 'กิจกรรม' | 'ประกาศทั่วไป' | 'ผลงานสภา';
    image_url: string | null;
    is_pinned: boolean;
    created_at: string;
}

export interface Member {
    id: number;
    created_at?: string;
    name: string;
    nickname: string;
    role: string;
    quote?: string | null;
    instagram?: string | null;
    image_url?: string | null;
    order?: number;
}
