import { Timestamp } from "firebase/firestore";
// app/types.ts
export interface BlogPost {
    id: string;
    summary: string;
    content: Array<{ value: string; type: string }>;
    tags: string[];
    header_image: string;
    name: string;
    slug: string;
    status: string;
    created_on: Timestamp;
    publish_date: string | null;
    reviewed: boolean;
}