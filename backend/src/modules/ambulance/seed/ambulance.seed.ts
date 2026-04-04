import { prisma } from "../../../lib/prisma.js";
import type{ Request, Response } from "express";

export const seedAmbulances = async (_req: Request, res: Response) => {
  try {
    const ambulances = [
    { id: "1", lat: 28.7041, lng: 77.1025 }, // Delhi center
    { id: "2", lat: 28.5355, lng: 77.3910 }, // Noida
    { id: "3", lat: 28.4595, lng: 77.0266 }, // Gurgaon
    { id: "4",lat: 28.6692, lng: 77.4538 }, // Ghaziabad
    { id: "5", lat: 28.4089, lng: 77.3178 }, // Faridabad
  ];

  for (const amb of ambulances) {
    await prisma.ambulance.create({
      data: {
        lat: amb.lat,
        lng: amb.lng,
        status: "AVAILABLE",
      },
    });
  }

  res.status(200).json({msg: "ambulances seeded"})
  } catch (err) {
    res.status(500).json({ error: "Failed to seed ambulances" });
  }
};
// async function seedAmbulances1() {
//   const ambulances = [
//     { lat: 28.7041, lng: 77.1025 }, // Delhi center
//     { lat: 28.5355, lng: 77.3910 }, // Noida
//     { lat: 28.4595, lng: 77.0266 }, // Gurgaon
//     { lat: 28.6692, lng: 77.4538 }, // Ghaziabad
//     { lat: 28.4089, lng: 77.3178 }, // Faridabad
//   ];

//   for (const amb of ambulances) {
//     await prisma.ambulance.create({
//       data: {
//         lat: amb.lat,
//         lng: amb.lng,
//         status: "AVAILABLE",
//       },
//     });
//   }

//   console.log("ambulances seeded");
// }

// seedAmbulances()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());