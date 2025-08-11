import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

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

  // Read demo people from CSV file
  const csvPath = path.join(__dirname, "demo-people.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",");

  const demoPersons = [];

  // Parse CSV and create people
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const personData = {
      firstName: values[0],
      lastName: values[1],
      email: values[2],
      phone: values[3],
      company: values[4],
      favoritePokemon: values[5],
      pokemonImageUrl: values[6],
      userId: user.id,
    };

    const person = await prisma.person.create({
      data: personData,
    });

    demoPersons.push(person);
  }

  // Keep the original two people for backward compatibility
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

  console.log(
    `Database seeded successfully! Created ${demoPersons.length + 2} people.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
