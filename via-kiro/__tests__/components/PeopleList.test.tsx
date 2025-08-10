import { render, screen } from "@testing-library/react";
import { PeopleList } from "@/components/people-list";

const mockPeople = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1-555-0123",
    company: "Acme Corp",
    favoritePokemon: "pikachu",
    pokemonImageUrl: "https://example.com/pikachu.png",
    notes: [
      { id: "1", title: "Meeting Notes" },
      { id: "2", title: "Follow-up" },
    ],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: null,
    company: null,
    favoritePokemon: null,
    pokemonImageUrl: null,
    notes: [],
  },
];

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("PeopleList", () => {
  it("renders people correctly", () => {
    render(<PeopleList people={mockPeople} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("shows correct note count", () => {
    render(<PeopleList people={mockPeople} />);

    expect(screen.getByText("2 notes")).toBeInTheDocument();
    expect(screen.getByText("0 notes")).toBeInTheDocument();
  });

  it("shows empty state when no people", () => {
    render(<PeopleList people={[]} />);

    expect(screen.getByText("No people")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by adding a new person.")
    ).toBeInTheDocument();
  });

  it("renders pokemon image when available", () => {
    render(<PeopleList people={mockPeople} />);

    const pokemonImage = screen.getByAltText("pikachu");
    expect(pokemonImage).toBeInTheDocument();
    expect(pokemonImage).toHaveAttribute(
      "src",
      "https://example.com/pikachu.png"
    );
  });
});
