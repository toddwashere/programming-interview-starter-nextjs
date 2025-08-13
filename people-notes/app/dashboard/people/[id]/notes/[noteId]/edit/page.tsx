"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { noteSchema, type NoteInput } from "@/lib/validations";
import { ArrowLeft } from "lucide-react";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  person: Person;
}

export default function EditNotePage({
  params,
}: {
  params: { id: string; noteId: string };
}) {
  const [note, setNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<NoteInput>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<NoteInput>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `/api/people/${params.id}/notes/${params.noteId}`
        );
        if (response.ok) {
          const noteData = await response.json();
          setNote(noteData);
          setFormData({
            title: noteData.title,
            content: noteData.content,
          });
        } else {
          router.push(`/dashboard/people/${params.id}`);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        router.push(`/dashboard/people/${params.id}`);
      } finally {
        setIsLoadingNote(false);
      }
    };

    fetchNote();
  }, [params.id, params.noteId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = noteSchema.parse(formData);

      const response = await fetch(
        `/api/people/${params.id}/notes/${params.noteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        }
      );

      if (response.ok) {
        router.push(`/dashboard/people/${params.id}`);
      } else {
        const error = await response.json();
        setErrors({ title: error.message });
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: any = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingNote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href={`/dashboard/people/${params.id}`} className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Note for {note.person.firstName} {note.person.lastName}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={errors.title ? "border-red-500" : ""}
                  placeholder="Enter note title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.content ? "border-red-500" : ""
                  }`}
                  placeholder="Enter note content"
                  rows={6}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Note"}
                </Button>
                <Link href={`/dashboard/people/${params.id}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
