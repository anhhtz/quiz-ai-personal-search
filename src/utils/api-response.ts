import { NextResponse } from "next/server"

export const ApiResponse = async (statusCode: number, status: string, data: any, error?: any) => {
    return NextResponse.json({ status, data, error }, { status: statusCode })
}