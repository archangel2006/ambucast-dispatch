import { prisma } from "../../lib/prisma.js";
import { calculateDistance } from "../../utils/distance.js";


export const runAllocation = async () => {
    const riskPriority: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
    };
    // const hotspots = await prisma.hotspot.findMany();
    const hotspots = (await prisma.hotspot.findMany()).sort(
    (a, b) => (riskPriority[b.risk] ?? 0) - (riskPriority[a.risk] ?? 0)
    );
    const ambulances = await prisma.ambulance.findMany({
        where: { status: "AVAILABLE" },
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
        // assign ambulance
        await prisma.ambulance.update({
            where: { id: nearestAmbulance.id },
            data: { status: "MOVING" },
        });

        // remove from pool (so it's not reused)
        const index = ambulances.findIndex(
            (a) => a.id === nearestAmbulance.id
        );
        ambulances.splice(index, 1);

        assignments.push({
            ambulanceId: nearestAmbulance.id,
            hotspot: hotspot.area,
            distance: minDistance,
        });
        }
    }

    return assignments;
};