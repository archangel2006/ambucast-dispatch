import zones from "../data/zones.json" with { type: "json" };
import { getAirData, getWeatherData } from "./dataService.js";
import { getTimeData } from "./timeService.js";

export const buildZonePayloads = async () => {
    const time = getTimeData();
        console.log("2")

    const entries = Object.entries(zones);

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

    console.log("results", results)

    return results;
};