import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search for Pokemon by name
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
    );

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const pokemon = await response.json();

    return NextResponse.json({
      results: [
        {
          name: pokemon.name,
          url: pokemon.sprites.front_default,
          id: pokemon.id,
        },
      ],
    });
  } catch (error) {
    // If exact match fails, try to get a list and filter
    try {
      const listResponse = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
      );
      const listData = await listResponse.json();

      const filtered = listData.results
        .filter((p: any) => p.name.includes(query.toLowerCase()))
        .slice(0, 5);

      // Get details for each filtered Pokemon
      const detailedResults = await Promise.all(
        filtered.map(async (p: any) => {
          try {
            const detailResponse = await fetch(p.url);
            const detail = await detailResponse.json();
            return {
              name: detail.name,
              url: detail.sprites.front_default,
              id: detail.id,
            };
          } catch {
            return null;
          }
        })
      );

      return NextResponse.json({
        results: detailedResults.filter(Boolean),
      });
    } catch {
      return NextResponse.json({ results: [] });
    }
  }
}
