import { prisma } from "../../lib/prisma.js";
import { calculateDistance } from "../../utils/distance.js";
import { getIO } from "../../sockets/socket.js";

export const runAllocation = async () => {
    const io = getIO();
    const riskPriority: Record<string, number> = {
      critical: 4,
      high: 3,
      moderate: 2,
      medium: 2,
      low: 1,
    };

    const statusPriority: Record<string, number> = {
      AVAILABLE: 1,
      MOVING: 2,
      BUSY: 3,
    };

    const hotspots = (await prisma.hotspot.findMany()).sort(
      (a, b) => {
        const aRisk = String(a.risk_class || 'low').toLowerCase();
        const bRisk = String(b.risk_class || 'low').toLowerCase();
        return (riskPriority[bRisk] ?? 0) - (riskPriority[aRisk] ?? 0);
      }
    );

    let ambulances = await prisma.ambulance.findMany({
        where: { status: { in: ["AVAILABLE", "MOVING"] } },
    });

    if (ambulances.length === 0) {
      ambulances = await prisma.ambulance.findMany();
    }

    ambulances.sort((a, b) => {
      return (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99);
    });

    const assignments: any[] = [];

    for (const hotspot of hotspots) {
        let nearestAmbulance = null;
        let minDistance = Infinity;

        for (const amb of ambulances) {
          const dist = calculateDistance(
              hotspot.lat,
              hotspot.lng,
              amb.lat,
              amb.lng
          );

          if (dist < minDistance) {
              minDistance = dist;
              nearestAmbulance = amb;
          }
        }

        if (nearestAmbulance) {
          await prisma.ambulance.update({
              where: { id: nearestAmbulance.id },
              data: { status: "MOVING" },
          });

          const index = ambulances.findIndex(
              (a) => a.id === nearestAmbulance.id
          );

          if (index !== -1) {
            ambulances.splice(index, 1);
          }

          assignments.push({
              ambulanceId: nearestAmbulance.id,
              hotspot: hotspot.area,
              distance: minDistance,
          });
        }
    }

    io.emit("allocation:updated", {
        assignments,
    });

    return assignments;
};