// Smart Bin Locations with Detailed Telemetry for "Live" Feel
export const SMART_BINS = [
    {
        id: 1,
        name: "GreenForge Kiosk #104",
        location: "Indore, MP",
        coordinates: { lat: 22.7196, lng: 75.8577 },
        status: "Online",
        capacity: 45,
        deviceID: "GF-IND-44X2",
        lastServiced: "2hrs ago",
        acceptedMaterials: ["Plastic", "Alum", "Paper"],
        sensors: { temp: "24°C", loadRaw: "14.5kg", compactor: "Idle" },
        stats24h: {
            transactions: 142,
            tokensDistributed: 850,
            trend: "+12%"
        }
    },
    {
        id: 2,
        name: "Metro Station Hub #22",
        location: "Mumbai, MH",
        coordinates: { lat: 19.0864, lng: 72.8889 },
        status: "Online",
        capacity: 82,
        deviceID: "GF-MUM-88Z9",
        lastServiced: "15mins ago",
        acceptedMaterials: ["HDPE", "Glass", "E-Waste"],
        sensors: { temp: "28°C", loadRaw: "42.1kg", compactor: "Active" },
        stats24h: {
            transactions: 315,
            tokensDistributed: 1890,
            trend: "+24%"
        }
    },
    {
        id: 3,
        name: "Tech Park Eco-Bin #09",
        location: "Bangalore, KA",
        coordinates: { lat: 12.9716, lng: 77.5946 },
        status: "Maintenance",
        capacity: 100,
        deviceID: "GF-BLR-12K5",
        lastServiced: "1 day ago",
        acceptedMaterials: ["PET", "Paper"],
        sensors: { temp: "26°C", loadRaw: "55.0kg", compactor: "Error" },
        stats24h: {
            transactions: 0,
            tokensDistributed: 0,
            trend: "0%"
        }
    },
    {
        id: 4,
        name: "Cyber City Return Point",
        location: "Gurugram, HR",
        coordinates: { lat: 28.4595, lng: 77.0266 },
        status: "Online",
        capacity: 12,
        deviceID: "GF-DEL-33M1",
        lastServiced: "4hrs ago",
        acceptedMaterials: ["Plastics", "Metal"],
        sensors: { temp: "32°C", loadRaw: "5.2kg", compactor: "Idle" },
        stats24h: {
            transactions: 89,
            tokensDistributed: 445,
            trend: "+5%"
        }
    }
];

// Mock Blockchain Database
export const MOCK_PRODUCT_DB = {
    "PKG-2026-ALPHA": {
        id: "PKG-2026-ALPHA",
        name: "Eco-Friendly Bamboo Container",
        brand: "NaturePack Inc.",
        material: "Biodegradable Composite",
        manufactureDate: "2025-11-15",
        batchHash: "0x7a9...f4d2",
        isRecycled: false,
        rewardValue: 5
    },
    "PKG-2026-BETA": {
        id: "PKG-2026-BETA",
        name: "Recycled Ocean Plastic Bottle",
        brand: "BlueWave",
        material: "rPET (100%)",
        manufactureDate: "2025-12-01",
        batchHash: "0xb3c...99a1",
        isRecycled: true,
        recyclingTimestamp: "2026-01-05T10:30:00Z",
        rewardValue: 2
    }
};
