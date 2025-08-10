"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building } from "lucide-react";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  favoritePokemon?: string | null;
  pokemonImageUrl?: string | null;
  notes: Array<{ id: string; title: string }>;
}

interface PeopleListProps {
  people: Person[];
}

export function PeopleList({ people }: PeopleListProps) {
  if (people.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No people</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new person.
        </p>
        <div className="mt-6">
          <Link href="/dashboard/people/new">
            <Button>Add Person</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {people.map((person) => (
        <Card key={person.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {person.firstName} {person.lastName}
              </CardTitle>
              {person.pokemonImageUrl && (
                <img
                  src={person.pokemonImageUrl}
                  alt={person.favoritePokemon}
                  className="w-8 h-8"
                  title={`Favorite Pokémon: ${person.favoritePokemon}`}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {person.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {person.email}
              </div>
            )}
            {person.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {person.phone}
              </div>
            )}
            {person.company && (
              <div className="flex items-center text-sm text-gray-600">
                <Building className="w-4 h-4 mr-2" />
                {person.company}
              </div>
            )}
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                {person.notes.length} note{person.notes.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="pt-2 flex space-x-2">
              <Link href={`/dashboard/people/${person.id}`}>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </Link>
              <Link href={`/dashboard/people/${person.id}/edit`}>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
