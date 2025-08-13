import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PeopleList } from "@/components/people-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";

async function getUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      people: {
        orderBy: { createdAt: "desc" },
        include: {
          notes: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PeopleNotes</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/examples/import-wizard">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Contacts
                </Button>
              </Link>
              <Link href="/dashboard/people/new">
                <Button>Add Person</Button>
              </Link>
              <Link href="/api/auth/logout">
                <Button variant="outline">Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PeopleList people={user.people} />
        </div>
      </main>
    </div>
  );
}
