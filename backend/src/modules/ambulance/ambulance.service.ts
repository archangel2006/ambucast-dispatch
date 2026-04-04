import { prisma } from "../../lib/prisma.js";

export const getAllAmbulances = async () => {
  return prisma.ambulance.findMany();
};

export const updateAmbulanceLocation = async (
  id: string,
  lat: number,
  lng: number
) => {
  const ambulance = await prisma.ambulance.findUnique({
    where: { id },
  });

  if (!ambulance) {
    throw new Error("Ambulance not found");
  }

  return prisma.ambulance.update({
    where: { id },
    data: { lat, lng },
  });
};

export const updateAmbulanceStatus = async (
  id: string,
  status: "AVAILABLE" | "BUSY" | "MOVING"
) => {
  return prisma.ambulance.update({
    where: { id },
    data: { status },
  });
};