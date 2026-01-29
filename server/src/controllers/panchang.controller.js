import { getPanchangam, Observer, tithiNames, nakshatraNames, yogaNames } from '@ishubhamx/panchangam-js';

/**
 * Get Panchang details for today using strict Vedic calculations
 * Default location: Varanasi (Kashi)
 */
export const getPanchang = async (req, res) => {
    try {
        // 1. Setup Location (Varanasi)
        const observer = new Observer(25.3176, 82.9739, 81); // Lat, Lng, Elevation (m)

        // 2. Setup Date (Current Date)
        const date = new Date();

        // 3. Calculate Panchang
        const panchang = getPanchangam(date, observer);

        // 4. Format Data for Frontend
        // Tithi: library returns 0-29. 0 = Prathama, 29 = Amavasya.
        const tithiName = tithiNames[panchang.tithi] || "Unknown";

        // Nakshatra Name
        const nakshatraName = nakshatraNames[panchang.nakshatra];

        // Yoga Name
        const yogaName = yogaNames[panchang.yoga];

        // Paksha Calculation (0-14 is Shukla, 15-29 is Krishna)
        const paksha = panchang.tithi < 15 ? "Shukla" : "Krishna";
        const fullTithi = `${paksha} Paksha ${tithiName}`;

        // Muhurats (Abhijit)
        let muhuratDisplay = "Not Available Today";
        if (panchang.abhijitMuhurta) {
            const start = panchang.abhijitMuhurta.start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const end = panchang.abhijitMuhurta.end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            muhuratDisplay = `${start} - ${end}`;
        }

        const panchangData = {
            date: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            tithi: fullTithi,
            nakshatra: nakshatraName,
            yoga: yogaName,
            muhurat: {
                name: "Abhijit Muhurat",
                time: muhuratDisplay
            },
            sunrise: panchang.sunrise ? panchang.sunrise.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "--:--",
            sunset: panchang.sunset ? panchang.sunset.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "--:--"
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
