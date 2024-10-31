import { NextResponse } from "next/server";
import crypto from "crypto-js/aes";


export function middleware() {
    const response = NextResponse.next();

    response.cookies.delete("wordul-a");

    const value = crypto.encrypt(process.env.WORDUL_ANSWER, process.env.NEXT_PUBLIC_WORDUL_SECRET).toString();

    response.cookies.set({
        name: "wordul-a",
        value,
        path: "/",
        maxAge: 2592000000,
        httpOnly: false,
        secure: false,
        sameSite: "strict"
    });

    return response;
}


export const config = {
    matcher: ["/"],
};

