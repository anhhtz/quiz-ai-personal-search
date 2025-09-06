import { ApiResponse } from "@/utils/api-response";
import getClientIP from "@/utils/ip";
import { logger } from "@/utils/logger";
import { NextRequest } from "next/server";
import { searchKns } from "./kns";

export async function POST(request: NextRequest) {
    const clientIP = getClientIP(request);
    const postData = await request.json()

    const { action } = postData

    switch (action) {

        case 'search_kns':
            logger.info(`[${clientIP}][api.search.xdd.route][POST] => {action: search_kns}`)
            const results = await searchKns(postData.keyword)
            // console.log(results)

            if (results) {
                return ApiResponse(200, "success", results?.hits || [])
            }
            else {
                return ApiResponse(200, "success", "No results found")
            }


        default:
    }
    return ApiResponse(400, "failed", null)
}