import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, Building, Edit, Plus } from "lucide-react";

async function getPerson(id: string) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const person = await prisma.person.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!person) {
    notFound();
  }

  return person;
}

export default async function PersonViewPage({
  params,
}: {
  params: { id: string };
}) {
  const person = await getPerson(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {person.firstName} {person.lastName}
                </h1>
                {person.company && (
                  <p className="text-gray-600">{person.company}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href={`/dashboard/people/${person.id}/notes/new`}>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </Link>
              <Link href={`/dashboard/people/${person.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {person.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{person.email}</span>
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{person.phone}</span>
                  </div>
                )}
                {person.company && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{person.company}</span>
                  </div>
                )}
                {person.favoritePokemon && (
                  <div className="flex items-center">
                    {person.pokemonImageUrl && (
                      <img
                        src={person.pokemonImageUrl}
                        alt={person.favoritePokemon}
                        className="w-8 h-8 mr-3"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Favorite Pokémon</p>
                      <p className="capitalize font-medium">
                        {person.favoritePokemon}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notes ({person.notes.length})</CardTitle>
                  <Link href={`/dashboard/people/${person.id}/notes/new`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {person.notes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No notes yet</p>
                    <Link href={`/dashboard/people/${person.id}/notes/new`}>
                      <Button className="mt-4" size="sm">
                        Add First Note
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {person.notes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{note.title}</h3>
                          <div className="flex space-x-2">
                            <Link
                              href={`/dashboard/people/${person.id}/notes/${note.id}/edit`}
                            >
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
