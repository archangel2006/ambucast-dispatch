import { prisma } from "../../lib/prisma.js";
import { getIO } from "../../sockets/socket.js";

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
  const io = getIO();

  if (!ambulance) {
    throw new Error("Ambulance not found");
  }

  const updated = prisma.ambulance.update({
    where: { id },
    data: { lat, lng },
  });
  io.emit("ambulance:moved", updated);

  return updated;
};

export const updateAmbulanceStatus = async (
  id: string,
  status: "AVAILABLE" | "BUSY" | "MOVING"
) => {
  const io = getIO();
  const updated = prisma.ambulance.update({
    where: { id },
    data: { status },
  });

  io.emit("ambulance:status", updated);

  return updated;
};