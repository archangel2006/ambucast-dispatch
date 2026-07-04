import { prisma } from "../../../lib/prisma.js";
import type{ Request, Response } from "express";

export const seedAmbulances = async (_req: Request, res: Response) => {
  try {
    const ambulances = [
      // North Delhi
      { lat: 28.7041, lng: 77.1025, zone: "zone_north" },
      { lat: 28.7150, lng: 77.1200, zone: "zone_north" },
      { lat: 28.7200, lng: 77.1100, zone: "zone_north" },
      
      // East Delhi
      { lat: 28.5900, lng: 77.3200, zone: "zone_east" },
      { lat: 28.5800, lng: 77.3100, zone: "zone_east" },
      { lat: 28.5950, lng: 77.3300, zone: "zone_east" },
      
      // South Delhi
      { lat: 28.5190, lng: 77.2300, zone: "zone_south" },
      { lat: 28.5100, lng: 77.2400, zone: "zone_south" },
      { lat: 28.5280, lng: 77.2250, zone: "zone_south" },
      
      // West Delhi
      { lat: 28.6500, lng: 76.9800, zone: "zone_west" },
      { lat: 28.6400, lng: 76.9900, zone: "zone_west" },
      { lat: 28.6600, lng: 76.9700, zone: "zone_west" },
      
      // Central Delhi
      { lat: 28.6300, lng: 77.2300, zone: "zone_central" },
      { lat: 28.6250, lng: 77.2250, zone: "zone_central" },
      { lat: 28.6350, lng: 77.2350, zone: "zone_central" },
      
      // Noida
      { lat: 28.5355, lng: 77.3910, zone: "zone_noida" },
      { lat: 28.5400, lng: 77.3950, zone: "zone_noida" },
      { lat: 28.5310, lng: 77.3870, zone: "zone_noida" },
      
      // Gurgaon
      { lat: 28.4595, lng: 77.0266, zone: "zone_gurgaon" },
      { lat: 28.4650, lng: 77.0300, zone: "zone_gurgaon" },
      { lat: 28.4540, lng: 77.0200, zone: "zone_gurgaon" },
      
      // Ghaziabad
      { lat: 28.6692, lng: 77.4538, zone: "zone_ghaziabad" },
      { lat: 28.6750, lng: 77.4600, zone: "zone_ghaziabad" },
      { lat: 28.6630, lng: 77.4470, zone: "zone_ghaziabad" },
      
      // Faridabad
      { lat: 28.4089, lng: 77.3178, zone: "zone_faridabad" },
      { lat: 28.4150, lng: 77.3250, zone: "zone_faridabad" },
      { lat: 28.4020, lng: 77.3100, zone: "zone_faridabad" },
    ];

    for (const amb of ambulances) {
      await prisma.ambulance.create({
        data: {
          lat: amb.lat,
          lng: amb.lng,
          status: "AVAILABLE",
          zoneId: amb.zone,
        },
      });
    }

    res.status(200).json({ msg: `ambulances seeded - ${ambulances.length} ambulances created` });
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