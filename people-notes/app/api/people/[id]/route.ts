import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { personSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const person = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!person) {
      return NextResponse.json(
        { message: "Person not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(person);
  } catch (error) {
    console.error("Get person error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = personSchema.parse(body);

    // Check if person exists and belongs to user
    const existingPerson = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existingPerson) {
      return NextResponse.json(
        { message: "Person not found" },
        { status: 404 }
      );
    }

    const updatedPerson = await prisma.person.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedPerson);
  } catch (error: any) {
    console.error("Update person error:", error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if person exists and belongs to user
    const existingPerson = await prisma.person.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existingPerson) {
      return NextResponse.json(
        { message: "Person not found" },
        { status: 404 }
      );
    }

    await prisma.person.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Person deleted successfully" });
  } catch (error) {
    console.error("Delete person error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
