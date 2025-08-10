import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  // Create some demo people
  const person1 = await prisma.person.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      company: "Acme Corp",
      favoritePokemon: "pikachu",
      pokemonImageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      userId: user.id,
    },
  });

  const person2 = await prisma.person.create({
    data: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-0456",
      company: "Tech Solutions",
      favoritePokemon: "charizard",
      pokemonImageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
      userId: user.id,
    },
  });

  // Create some demo notes
  await prisma.note.createMany({
    data: [
      {
        title: "Meeting Notes",
        content:
          "Discussed project timeline and deliverables. John is very detail-oriented.",
        personId: person1.id,
      },
      {
        title: "Follow-up",
        content: "Need to send contract details by Friday.",
        personId: person1.id,
      },
      {
        title: "Initial Contact",
        content:
          "Jane reached out about consulting services. Very interested in our AI solutions.",
        personId: person2.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
