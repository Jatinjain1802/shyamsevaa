import { MhahPanchang as Panchang } from 'mhah-panchang';

/**
 * Get Panchang details for today
 * Default location: Varanasi (Kashi)
 */
export const getPanchang = async (req, res) => {
    try {
        const panchangObj = new Panchang();
        const date = new Date();
        const lat = 25.3176;
        const lon = 82.9739;

        // 1. Calculate Panchang using mhah-panchang
        const mhahCal = panchangObj.calendar(date, lat, lon);
        const sunTimer = panchangObj.sunTimer(date, lat, lon);

        // 2. Extract and format values
        const tithi = mhahCal.Tithi.name_en_IN;
        const paksha = mhahCal.Paksha.name_en_IN;
        const fullTithi = `${paksha} Paksha ${tithi}`;

        const nakshatraName = mhahCal.Nakshatra.name_en_IN;
        const yogaName = mhahCal.Yoga.name_en_IN;

        // 3. Sunrise and Sunset
        const sunriseDate = new Date(sunTimer.sunRise);
        const sunsetDate = new Date(sunTimer.sunSet);

        const sunriseTime = sunriseDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const sunsetTime = sunsetDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

        // 4. Calculate Abhijit Muhurat (Roughly the 8th muhurta of the day)
        // Day length = Sunset - Sunrise
        // Each muhurta = Day length / 15
        // Abhijit is the 8th muhurta: from (Sunrise + 7 * muhurtaLength) to (Sunrise + 8 * muhurtaLength)
        const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
        const muhurtaLengthMs = dayLengthMs / 15;

        const abhijitStart = new Date(sunriseDate.getTime() + 7 * muhurtaLengthMs);
        const abhijitEnd = new Date(sunriseDate.getTime() + 8 * muhurtaLengthMs);

        const abhijitDisplay = `${abhijitStart.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${abhijitEnd.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

        const panchangData = {
            date: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            tithi: fullTithi,
            nakshatra: nakshatraName,
            yoga: yogaName,
            muhurat: {
                name: "Abhijit Muhurat",
                time: abhijitDisplay
            },
            sunrise: sunriseTime,
            sunset: sunsetTime
        };

        return res.status(200).json({
            success: true,
            data: panchangData
        });

    } catch (error) {
        console.error("Panchang Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch panchang details"
        });
    }
};
