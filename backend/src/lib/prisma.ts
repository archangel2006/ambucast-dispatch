//new
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.js"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({
  adapter,
});

// import { PrismaClient } from "../generated/prisma/client.js";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma
// }