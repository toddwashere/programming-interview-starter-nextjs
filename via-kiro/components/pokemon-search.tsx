"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Pokemon {
  name: string;
  url: string;
  id: number;
}

interface PokemonSearchProps {
  onSelect: (pokemon: Pokemon) => void;
  selectedPokemon?: Pokemon | null;
}

export function PokemonSearch({
  onSelect,
  selectedPokemon,
}: PokemonSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchPokemon = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/pokemon/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Pokemon search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPokemon, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Favorite Pokémon
        </label>
        <Input
          type="text"
          placeholder="Search for a Pokémon..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {selectedPokemon && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <img
                src={selectedPokemon.url}
                alt={selectedPokemon.name}
                className="w-12 h-12"
              />
              <div>
                <p className="font-medium capitalize">{selectedPokemon.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(null as any)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-sm text-gray-500">Searching...</p>}

      {results.length > 0 && !selectedPokemon && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.map((pokemon) => (
            <Card key={pokemon.id} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-3">
                <div
                  className="flex items-center space-x-3"
                  onClick={() => onSelect(pokemon)}
                >
                  <img
                    src={pokemon.url}
                    alt={pokemon.name}
                    className="w-10 h-10"
                  />
                  <p className="font-medium capitalize">{pokemon.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
