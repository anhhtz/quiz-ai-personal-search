import cache from "@/utils/cache";
import { algoliasearch } from "algoliasearch";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID!;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY!;

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
    throw new Error("ALGOLIA_APP_ID or ALGOLIA_API_KEY is not defined")
}

const ALGOLIA_INDEX_NAME = "kns2025";
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

export const searchKns = async (query: string) => {
    if (!query) {
        return null
    }

    const cachedKey = `kns:${query}`;

    // check cache first
    const cached = await cache.get(cachedKey);

    if (cached) {
        console.log("cache hit");
        return (cached);
    }
    else {
        console.log("cache miss => fetching from algolia");
        const response = await searchInAlgolia(query);
        await cache.set(cachedKey, JSON.stringify(response));
        return response;
    }
}



const searchInAlgolia = async (query: string) => {
    const response = await client.searchSingleIndex({
        indexName: ALGOLIA_INDEX_NAME,
        searchParams: {
            query,
        },
    });
    return response;
}