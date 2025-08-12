import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { noteSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the person exists and belongs to the user
    const person = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!person) {
      return NextResponse.json(
        { message: "Person not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = noteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        ...validatedData,
        personId: params.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error("Create note error:", error);

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
