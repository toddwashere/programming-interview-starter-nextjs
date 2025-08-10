"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokemonSearch } from "@/components/pokemon-search";
import { personSchema, type PersonInput } from "@/lib/validations";
import { ArrowLeft } from "lucide-react";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  favoritePokemon?: string | null;
  pokemonImageUrl?: string | null;
}

export default function EditPersonPage({ params }: { params: { id: string } }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState<PersonInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    favoritePokemon: "",
    pokemonImageUrl: "",
  });
  const [errors, setErrors] = useState<Partial<PersonInput>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await fetch(`/api/people/${params.id}`);
        if (response.ok) {
          const personData = await response.json();
          setPerson(personData);
          setFormData({
            firstName: personData.firstName || "",
            lastName: personData.lastName || "",
            email: personData.email || "",
            phone: personData.phone || "",
            company: personData.company || "",
            favoritePokemon: personData.favoritePokemon || "",
            pokemonImageUrl: personData.pokemonImageUrl || "",
          });

          if (personData.favoritePokemon && personData.pokemonImageUrl) {
            setSelectedPokemon({
              name: personData.favoritePokemon,
              url: personData.pokemonImageUrl,
              id: 0, // We don't store the Pokemon ID
            });
          }
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching person:", error);
        router.push("/dashboard");
      }
    };

    fetchPerson();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = personSchema.parse(formData);

      const response = await fetch(`/api/people/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        router.push(`/dashboard/people/${params.id}`);
      } else {
        const error = await response.json();
        setErrors({ firstName: error.message });
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

  const handlePokemonSelect = (pokemon: any) => {
    if (pokemon) {
      setSelectedPokemon(pokemon);
      setFormData({
        ...formData,
        favoritePokemon: pokemon.name,
        pokemonImageUrl: pokemon.url,
      });
    } else {
      setSelectedPokemon(null);
      setFormData({
        ...formData,
        favoritePokemon: "",
        pokemonImageUrl: "",
      });
    }
  };

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
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
              Edit {person.firstName} {person.lastName}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Person Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              <PokemonSearch
                onSelect={handlePokemonSelect}
                selectedPokemon={selectedPokemon}
              />

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
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
