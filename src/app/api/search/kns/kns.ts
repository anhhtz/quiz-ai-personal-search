import { algoliasearch } from "algoliasearch";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID!;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY!;

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
    throw new Error("ALGOLIA_APP_ID or ALGOLIA_API_KEY is not defined")
}

const ALGOLIA_INDEX_NAME = "kns2025";

export const searchKns = async (query: string) => {
    if (!query) {
        return null
    }

    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

    const response = await client.searchSingleIndex({
        indexName: ALGOLIA_INDEX_NAME,
        searchParams: {
            query,
        },
    });

    return response;



}