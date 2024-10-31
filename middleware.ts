import { NextResponse } from "next/server";

export function middleware() {
    const response = NextResponse.next();

    response.cookies.delete("wordul-a");

    response.cookies.set({
        name: "wordul-a",
        value: "angry",
        path: "/",
        maxAge: 2592000000,
        httpOnly: false,
        secure: false
    });

    return response;
}


export const config = {
    matcher: ["/"],
};

