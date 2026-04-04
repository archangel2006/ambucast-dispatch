"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
//new
require("dotenv/config");
var adapter_pg_1 = require("@prisma/adapter-pg");
var client_js_1 = require("../generated/prisma/client.js");
var adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
exports.prisma = new client_js_1.PrismaClient({
    adapter: adapter,
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
