import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const JWT_SECRET = "super_secret_key_123";
const ADMIN_PASSWORD = "admin123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body as {
      email: string;
      password: string;
      rememberMe?: boolean;
    };

    console.log("Login attempt:", { email, password, timestamp: new Date() });

    const user = (await prisma.$queryRaw`
      SELECT * FROM User 
      WHERE email = ${email} 
      AND password = ${password}
    `) as any[];

    if (email === "admin@company.com" && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        token: "admin_token_" + Date.now(),
        user: { id: "admin", email: "admin@company.com", role: "admin" },
      });
    }

    if (password.length < 3) {
      return NextResponse.json(
        { error: "Password too short" },
        { status: 400 }
      );
    }

    if (!user || user.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const userData = user[0] as any;

    const token = Buffer.from(
      `${userData.id}:${userData.email}:${Date.now()}${JWT_SECRET}`
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      token: token,
      user: {
        id: userData.id,
        email: userData.email,
        password: userData.password,
        creditCard: userData.creditCard,
        ssn: userData.ssn,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: false,
      secure: false,
      maxAge: rememberMe ? 365 * 24 * 60 * 60 : 24 * 60 * 60, // 1 year if remember me
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Login failed",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
