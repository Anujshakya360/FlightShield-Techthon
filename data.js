// Mock flight data for FlightShield demonstration
const flightData = [
    {
        airline: "Yeti Airlines",
        flight: "YT-202",
        aircraftAge: 26,
        pilotHours: 220,
        pilotName: "Capt. Rajesh Kumar",
        pilotCertifications: ["Commercial Pilot License", "Instrument Rating"],
        lastMaintenance: "2023-09-01",
        crashHistory: 2,
        wasteCleanDate: "2024-03-01",
        fuelCleanDate: "2024-02-15",
        safetyScore: "Low",
        safetyRating: 3.2,
        engineHealth: 65,
        fuelContamination: 15,
        maintenanceLogs: [
            {
                date: "2023-09-01",
                type: "Engine Overhaul",
                severity: "critical",
                description: "Complete engine rebuild due to metal fatigue detected in compressor blades."
            },
            {
                date: "2023-12-15",
                type: "Routine Inspection",
                severity: "routine",
                description: "Standard 100-hour inspection completed. Minor hydraulic leak detected and repaired."
            }
        ],
        incidentHistory: [
            {
                date: "2023-08-15",
                type: "engine",
                severity: "critical",
                description: "Engine failure during takeoff. Emergency landing performed successfully."
            },
            {
                date: "2024-01-22",
                type: "maintenance",
                severity: "warning",
                description: "Landing gear warning light malfunction. Found to be faulty sensor."
            }
        ]
    },
    {
        airline: "Yeti Airlines",
        flight: "YT-105",
        aircraftAge: 8,
        pilotHours: 1250,
        pilotName: "Capt. Sita Sharma",
        pilotCertifications: ["ATP License", "Type Rating A320", "Instructor Rating"],
        lastMaintenance: "2024-06-15",
        crashHistory: 0,
        wasteCleanDate: "2024-06-20",
        fuelCleanDate: "2024-06-18",
        safetyScore: "High",
        safetyRating: 8.7,
        engineHealth: 92,
        fuelContamination: 2,
        maintenanceLogs: [
            {
                date: "2024-06-15",
                type: "Scheduled Maintenance",
                severity: "routine",
                description: "200-hour inspection completed. All systems operating within normal parameters."
            },
            {
                date: "2024-04-10",
                type: "Avionics Update",
                severity: "routine",
                description: "Navigation system software updated to latest version."
            }
        ],
        incidentHistory: []
    },
    {
        airline: "Nepal Airlines",
        flight: "RA-201",
        aircraftAge: 15,
        pilotHours: 850,
        pilotName: "Capt. Bikram Thapa",
        pilotCertifications: ["Commercial Pilot License", "Multi-Engine Rating"],
        lastMaintenance: "2024-04-20",
        crashHistory: 1,
        wasteCleanDate: "2024-05-10",
        fuelCleanDate: "2024-05-12",
        safetyScore: "Medium"
    },
    {
        airline: "Nepal Airlines",
        flight: "RA-445",
        aircraftAge: 3,
        pilotHours: 2100,
        pilotName: "Capt. Maya Gurung",
        pilotCertifications: ["ATP License", "Type Rating B737", "Check Airman"],
        lastMaintenance: "2024-06-28",
        crashHistory: 0,
        wasteCleanDate: "2024-07-01",
        fuelCleanDate: "2024-06-30",
        safetyScore: "High"
    },
    {
        airline: "Buddha Air",
        flight: "U4-201",
        aircraftAge: 12,
        pilotHours: 1500,
        pilotName: "Capt. Arjun Rai",
        pilotCertifications: ["ATP License", "Type Rating ATR", "Mountain Flying"],
        lastMaintenance: "2024-05-15",
        crashHistory: 0,
        wasteCleanDate: "2024-06-25",
        fuelCleanDate: "2024-06-22",
        safetyScore: "High"
    },
    {
        airline: "Buddha Air",
        flight: "U4-505",
        aircraftAge: 18,
        pilotHours: 650,
        pilotName: "Capt. Priya Tamang",
        pilotCertifications: ["Commercial Pilot License", "Instrument Rating"],
        lastMaintenance: "2024-03-10",
        crashHistory: 1,
        wasteCleanDate: "2024-04-05",
        fuelCleanDate: "2024-04-08",
        safetyScore: "Medium"
    },
    {
        airline: "Shree Airlines",
        flight: "SHA-201",
        aircraftAge: 22,
        pilotHours: 400,
        pilotName: "Capt. Deepak Limbu",
        pilotCertifications: ["Commercial Pilot License"],
        lastMaintenance: "2023-12-15",
        crashHistory: 3,
        wasteCleanDate: "2024-01-20",
        fuelCleanDate: "2024-01-18",
        safetyScore: "Low"
    },
    {
        airline: "Shree Airlines",
        flight: "SHA-301",
        aircraftAge: 7,
        pilotHours: 1800,
        pilotName: "Capt. Kamala Magar",
        pilotCertifications: ["ATP License", "Type Rating DHC-6", "Chief Pilot"],
        lastMaintenance: "2024-06-10",
        crashHistory: 0,
        wasteCleanDate: "2024-06-28",
        fuelCleanDate: "2024-06-26",
        safetyScore: "High"
    }
];

// Airline comparison data
const airlineComparison = [
    {
        name: "Yeti Airlines",
        logo: "✈️",
        avgFleetAge: 17,
        crashHistory: 2,
        maintenanceFreq: "Every 3 months",
        avgPilotExp: 735,
        safetyRating: 6.5
    },
    {
        name: "Nepal Airlines",
        logo: "🇳🇵",
        avgFleetAge: 9,
        crashHistory: 1,
        maintenanceFreq: "Every 2 months",
        avgPilotExp: 1475,
        safetyRating: 8.2
    },
    {
        name: "Buddha Air",
        logo: "☸️",
        avgFleetAge: 15,
        crashHistory: 1,
        maintenanceFreq: "Every 2.5 months",
        avgPilotExp: 1075,
        safetyRating: 7.8
    },
    {
        name: "Shree Airlines",
        logo: "🏔️",
        avgFleetAge: 14.5,
        crashHistory: 3,
        maintenanceFreq: "Every 4 months",
        avgPilotExp: 1100,
        safetyRating: 6.8
    }
];

// Alert messages for live feed
const alertMessages = [
    "Engine temperature within normal range",
    "Hydraulic pressure optimal",
    "Fuel system check complete",
    "Landing gear status: Operational",
    "Cabin pressure stabilized",
    "Navigation systems online",
    "Weather radar functioning",
    "Autopilot engaged successfully",
    "Communication systems clear",
    "Emergency equipment verified",
    "⚠️ Engine overheating detected - monitoring",
    "⚠️ Minor hydraulic pressure drop - investigating",
    "⚠️ Fuel contamination possible - checking filters",
    "⚠️ Landing gear sensor malfunction - backup active",
    "⚠️ Cabin pressure fluctuation - stabilizing",
    "🚨 Critical: Engine failure simulation",
    "🚨 Critical: Hydraulic system failure",
    "🚨 Critical: Fuel leak detected"
];

// Engine monitoring thresholds
const engineThresholds = {
    temperature: { min: 200, max: 800, critical: 750 },
    fuelPressure: { min: 20, max: 60, critical: 55 },
    hydraulicPressure: { min: 1500, max: 3000, critical: 2800 }
};

// Weather route data
const weatherRoutes = {
    clear: {
        risk: 12,
        delay: 5,
        impact: "minimal",
        alert: "Clear conditions ahead - All Systems Normal"
    },
    cloudy: {
        risk: 25,
        delay: 10,
        impact: "minimal",
        alert: "Light cloud cover - Visibility good"
    },
    storm: {
        risk: 78,
        delay: 45,
        impact: "severe",
        alert: "⚠️ Thunderstorm activity - Turbulence expected"
    },
    fog: {
        risk: 65,
        delay: 30,
        impact: "moderate",
        alert: "⚠️ Heavy fog conditions - Reduced visibility"
    },
    wind: {
        risk: 45,
        delay: 20,
        impact: "moderate",
        alert: "⚠️ High wind conditions - Possible turbulence"
    }
};

// Passenger reports data
const passengerReports = [
    {
        id: 1,
        flight: "YT-202",
        airline: "Yeti Airlines",
        date: "2024-07-08",
        report: "Strange noise during takeoff, sounded like metal grinding. Crew said it was normal but seemed concerned.",
        severity: "warning"
    },
    {
        id: 2,
        flight: "RA-445",
        airline: "Nepal Airlines",
        date: "2024-07-07",
        report: "Smooth flight, professional crew, felt very safe throughout the journey.",
        severity: "positive"
    },
    {
        id: 3,
        flight: "U4-201",
        airline: "Buddha Air",
        date: "2024-07-06",
        report: "Strong smell of fuel in the cabin during boarding. Took 20 minutes to resolve.",
        severity: "warning"
    },
    {
        id: 4,
        flight: "SHA-201",
        airline: "Shree Airlines",
        date: "2024-07-05",
        report: "Landing was extremely rough, passengers were visibly shaken. Multiple items fell from overhead bins.",
        severity: "critical"
    }
];

// Flight ratings data
const flightRatings = {
    "YT-202": { average: 2.3, total: 47, ratings: [12, 8, 15, 7, 5] },
    "YT-105": { average: 4.6, total: 23, ratings: [1, 2, 3, 8, 9] },
    "RA-201": { average: 3.8, total: 31, ratings: [2, 4, 8, 12, 5] },
    "RA-445": { average: 4.8, total: 19, ratings: [0, 1, 2, 6, 10] },
    "U4-201": { average: 4.2, total: 28, ratings: [1, 3, 5, 11, 8] },
    "U4-505": { average: 3.5, total: 22, ratings: [3, 5, 7, 4, 3] },
    "SHA-201": { average: 2.1, total: 35, ratings: [15, 8, 7, 3, 2] },
    "SHA-301": { average: 4.4, total: 16, ratings: [0, 2, 3, 7, 4] }
};

// Historical incidents database
const historicalIncidents = [
    {
        id: 1,
        date: "2023-08-15",
        airline: "Yeti Airlines",
        flight: "YT-202",
        aircraft: "DHC-6 Twin Otter",
        type: "engine",
        cause: "Engine failure during takeoff",
        severity: "critical",
        outcome: "Emergency landing, no casualties"
    },
    {
        id: 2,
        date: "2023-11-22",
        airline: "Nepal Airlines",
        flight: "RA-201",
        aircraft: "ATR 72",
        type: "weather",
        cause: "Severe turbulence due to unexpected weather",
        severity: "warning",
        outcome: "Minor injuries to 3 passengers"
    },
    {
        id: 3,
        date: "2024-01-10",
        airline: "Buddha Air",
        flight: "U4-505",
        aircraft: "Beechcraft 1900D",
        type: "pilot",
        cause: "Hard landing due to approach error",
        severity: "warning",
        outcome: "Aircraft damage, no injuries"
    },
    {
        id: 4,
        date: "2024-02-28",
        airline: "Shree Airlines",
        flight: "SHA-201",
        aircraft: "Dornier 228",
        type: "maintenance",
        cause: "Hydraulic system failure",
        severity: "critical",
        outcome: "Emergency landing, aircraft retired"
    }
];

// Live chart data for Black Box 2.0
const chartData = {
    temperature: [],
    vibration: [],
    pressure: [],
    speed: []
};

// Initialize chart data with 50 data points
for (let i = 0; i < 50; i++) {
    chartData.temperature.push(500 + Math.random() * 100);
    chartData.vibration.push(1.8 + Math.random() * 1.2);
    chartData.pressure.push(14.2 + Math.random() * 1.0);
    chartData.speed.push(570 + Math.random() * 20);
}