import zones from "../data/zones.json" with { type: "json" };
import { getAirData, getWeatherData } from "./dataService.js";
import { getTimeData } from "./timeService.js";
import { getPredictions } from "./mlService.js";  

export const buildZonePayloads = async () => {
    const time = getTimeData();
    const entries = Object.entries(zones);

    // Step 1: Build zone data with air & weather
    const results = await Promise.all(
        entries.map(async ([zone_id, zone]: any) => {
            const [air, weather] = await Promise.all([
                getAirData(zone.lat, zone.lng),
                getWeatherData(zone.lat, zone.lng)
            ]);

            return {
                zone_id,
                ...air,
                ...weather,
                ...time,
                population_density: zone.population_density,
                elderly_pct: zone.elderly_pct
            };
        })
    );

    console.log("Zone payloads built:", results.length, "zones");

    // Step 2: Get ML predictions ← ADD THIS BLOCK
    try {
        console.log("Calling ML API for predictions...");
        const predictions = await getPredictions(results);
        console.log("ML API returned predictions");

        // Step 3: Merge predictions with zone data ← ADD THIS BLOCK
        const enrichedResults = results.map(zone => {
            const prediction = predictions.find(p => p.zone_id === zone.zone_id);
            return {
                ...zone,
                ...(prediction || {
                    predicted_calls: 0,
                    risk_score: 0,
                    risk_class: "LOW",
                    reasons: ["No prediction available"]
                })
            };
        });

        console.log("Pipeline complete with predictions");
        return enrichedResults;
    } catch (error) {
        console.error("Error getting ML predictions, returning zone data only:", error);
        // Return zone data without predictions if ML API fails
        return results;
    }
};