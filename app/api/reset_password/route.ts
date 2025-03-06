import ResponseCache from "next/dist/server/response-cache";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: Request) {
    const data = await request.json()
    const { email, password } = data
    if (password === "success") {
        return Response.json({ status: "Exitoso" })
    }
    else {
        return new Response("Bad request", {status: 400})
    }
}
