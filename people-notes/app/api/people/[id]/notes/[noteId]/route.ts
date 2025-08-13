import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { noteSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the note exists and belongs to a person owned by the user
    const note = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        person: {
          id: params.id,
          userId,
        },
      },
      include: {
        person: true,
      },
    });

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error("Get note error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the note exists and belongs to a person owned by the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        person: {
          id: params.id,
          userId,
        },
      },
    });

    if (!existingNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = noteSchema.parse(body);

    const updatedNote = await prisma.note.update({
      where: { id: params.noteId },
      data: validatedData,
    });

    return NextResponse.json(updatedNote);
  } catch (error: any) {
    console.error("Update note error:", error);

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
  { params }: { params: { id: string; noteId: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the note exists and belongs to a person owned by the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        person: {
          id: params.id,
          userId,
        },
      },
    });

    if (!existingNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    await prisma.note.delete({
      where: { id: params.noteId },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error: any) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
