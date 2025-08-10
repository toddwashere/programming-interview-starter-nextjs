import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { personSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = personSchema.parse(body);

    const person = await prisma.person.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error: any) {
    console.error("Create person error:", error);

    if (error.errors) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
