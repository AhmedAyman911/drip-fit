import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createClient() {
  const url = new URL(process.env.DATABASE_URL!);

  // Prisma's "?schema=" URL parameter isn't understood by the pg driver, so pass it separately.
  const schema = url.searchParams.get("schema") ?? undefined;
  url.searchParams.delete("schema");

  const adapter = new PrismaPg({ connectionString: url.toString() }, { schema });

  return new PrismaClient({ adapter, log: ["error", "warn"] });
}

const globalForPrisma = global as unknown as { prisma?: ReturnType<typeof createClient> };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
