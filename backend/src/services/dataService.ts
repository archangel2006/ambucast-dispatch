const API_KEY = process.env.OPENWEATHER_API_KEY;

export const getAirData = async (lat: number, lng: number) => {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`
        );
        //http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}
        console.log(res);

        if (!res.ok) {
            console.log(res);
            throw new Error("air api failed");
        }

        const data: any = await res.json();
        console.log("air data",data);

        return {
            aqi: data.list[0].main.aqi,
            pm25: data.list[0].components.pm2_5,
            pm10: data.list[0].components.pm10
        };
};

export const getWeatherData = async (lat: number, lng: number) => {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) {
            console.log(res);
            throw new Error("weather api failed");
        }

        const data: any = await res.json();
        console.log("data", data)

        return {
            temperature: data.main.temp,
            humidity: data.main.humidity
        };
};