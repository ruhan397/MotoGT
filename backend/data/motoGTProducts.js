
const motoGTProducts = [
    // =====================================
    // INTERIOR ACCESSORIES (6)
    // =====================================
    {
      name: "Comfort Leatherette Seat Cover Set",
      brand: "AutoFit",
      category: "Interior Accessories",
      price: 4500,
      description: "Universal-style premium leatherette seat cover set designed to refresh the cabin and protect original upholstery. Vehicle compatibility should be checked before installation.",
      specifications: [
        "Premium leatherette finish",
        "Easy-clean surface",
        "Cushioned seat protection",
        "Universal-style fitment",
        "Check vehicle seat compatibility"
      ],
      stock: 10,
      image: ""
    },
    {
      name: "3D All-Weather Car Floor Mat Set",
      brand: "MotoGT Select",
      category: "Interior Accessories",
      price: 5800,
      description: "A shaped floor mat set designed to help protect the vehicle floor from dust, mud and everyday spills.",
      specifications: [
        "3D-style contoured design",
        "All-weather floor protection",
        "Easy-to-clean material",
        "Anti-slip backing",
        "Vehicle-specific fitment recommended"
      ],
      stock: 8,
     image: "/products/3D%2520All-Weather%2520Car%2520Floor%2520Mat%2520Set.jpg"
    },
    {
      name: "Anti-Slip Steering Wheel Cover",
      brand: "MotoGT Select",
      category: "Interior Accessories",
      price: 1200,
      description: "Comfortable steering wheel cover with a textured grip to improve handling comfort and protect the original steering wheel.",
      specifications: [
        "Anti-slip textured surface",
        "Comfort grip design",
        "Wear protection",
        "Universal-size options",
        "Check steering wheel diameter"
      ],
      stock: 15,
      image: ""
    },
    {
      name: "Memory Foam Car Neck Pillow Pair",
      brand: "MotoGT Select",
      category: "Interior Accessories",
      price: 1500,
      description: "A pair of supportive neck pillows designed to improve comfort during daily commutes and longer journeys.",
      specifications: [
        "Memory foam cushioning",
        "Pair of two pillows",
        "Soft fabric cover",
        "Adjustable strap",
        "Removable cover"
      ],
      stock: 12,
      image: ""
    },
    {
      name: "Universal Car Seat Cushion Pair",
      brand: "MotoGT Select",
      category: "Interior Accessories",
      price: 1800,
      description: "Comfort-focused seat cushion pair for additional support during everyday driving.",
      specifications: [
        "Two-piece cushion set",
        "Comfort padding",
        "Breathable fabric surface",
        "Non-slip base",
        "Universal-style design"
      ],
      stock: 10,
      image: ""
    },
    {
      name: "Backseat Multi-Pocket Organizer",
      brand: "MotoGT Select",
      category: "Interior Accessories",
      price: 950,
      description: "A practical rear-seat organizer for keeping travel accessories and small essentials neatly arranged.",
      specifications: [
        "Multiple storage pockets",
        "Seat-back mounting straps",
        "Easy-clean fabric",
        "Compact storage design",
        "Universal-style fit"
      ],
      stock: 15,
      image: ""
    },
  
    // =====================================
    // SPEAKERS & AUDIO (6)
    // =====================================
    {
      name: "TS-G1620F 6.5-Inch 2-Way Car Speakers",
      brand: "Pioneer",
      category: "Speakers & Audio",
      price: 5465,
      description: "Pioneer G-Series coaxial speakers designed to deliver balanced sound with clear high frequencies and improved bass response.",
      specifications: [
        "Model: TS-G1620F",
        "6.5-inch coaxial 2-way design",
        "300W maximum music power",
        "40W nominal power",
        "IMPP woofer cone",
        "PET balanced dome tweeter"
      ],
      stock: 6,
      image: ""
    },
    {
      name: "TS-A1678S 3-Way Coaxial Car Speakers",
      brand: "Pioneer",
      category: "Speakers & Audio",
      price: 9350,
      description: "Pioneer 3-way coaxial car speakers designed for a fuller in-car audio experience.",
      specifications: [
        "Model: TS-A1678S",
        "6.5-inch speaker format",
        "3-way coaxial design",
        "Designed for car door installation",
        "Check vehicle speaker mounting size"
      ],
      stock: 5,
      image: ""
    },
    {
      name: "NBF10.2A Active Car Subwoofer",
      brand: "Nakamichi",
      category: "Speakers & Audio",
      price: 16851,
      description: "An active subwoofer system designed to add deeper bass to a compatible car audio setup.",
      specifications: [
        "Model: NBF10.2A",
        "10-inch subwoofer category",
        "Active subwoofer enclosure",
        "Integrated amplification",
        "Professional installation recommended"
      ],
      stock: 4,
      image: ""
    },
    {
      name: "Club 6520 6.5-Inch Car Speakers",
      brand: "JBL",
      category: "Speakers & Audio",
      price: 6500,
      description: "JBL Club-series style speaker upgrade for drivers looking for clearer and more detailed in-car audio.",
      specifications: [
        "Model: Club 6520",
        "6.5-inch speaker format",
        "Designed for car audio use",
        "Check mounting depth",
        "Compatible amplifier selection recommended"
      ],
      stock: 5,
      image: ""
    },
    {
      name: "MVH-S125UI Car Media Receiver",
      brand: "Pioneer",
      category: "Speakers & Audio",
      price: 7500,
      description: "A single-DIN car media receiver for upgrading a vehicle's basic audio system.",
      specifications: [
        "Model: MVH-S125UI",
        "Single-DIN receiver format",
        "USB media playback",
        "FM radio",
        "Vehicle wiring compatibility required"
      ],
      stock: 5,
      image: ""
    },
    {
      name: "4-Channel Car Audio Amplifier",
      brand: "MotoGT Select",
      category: "Speakers & Audio",
      price: 8500,
      description: "A multi-channel amplifier option for compatible car speaker systems. Exact power matching should be checked before installation.",
      specifications: [
        "4-channel amplifier configuration",
        "Designed for automotive audio systems",
        "Speaker and impedance matching required",
        "Cooling and ventilation recommended",
        "Professional installation recommended"
      ],
      stock: 4,
      image: ""
    },
  
    // =====================================
    // CAR MONITORS (5)
    // =====================================
    {
      name: "NAM5260TY 7-Inch Android Receiver",
      brand: "Nakamichi",
      category: "Car Monitors",
      price: 13999,
      description: "A 7-inch Android multimedia receiver for compatible vehicle dashboards, offering touchscreen entertainment and connectivity.",
      specifications: [
        "Model: NAM5260TY",
        "7-inch HD display",
        "Android-based multimedia system",
        "Touchscreen operation",
        "Wi-Fi and Bluetooth connectivity",
        "Dashboard fitment must be checked"
      ],
      stock: 4,
      image: ""
    },
    {
      name: "NAM5360 Pro Android Multimedia Receiver",
      brand: "Nakamichi",
      category: "Car Monitors",
      price: 15500,
      description: "An Android multimedia receiver with IPS touchscreen display and expanded storage for compatible car entertainment systems.",
      specifications: [
        "Model: NAM5360 Pro",
        "2GB RAM",
        "64GB internal storage",
        "IPS touchscreen display",
        "Apple CarPlay and Android Auto support",
        "Built-in DSP audio processing"
      ],
      stock: 4,
      image: ""
    },
    {
      name: "NAM5710-A11.5 Android Car Player",
      brand: "Nakamichi",
      category: "Car Monitors",
      price: 24999,
      description: "A dual-knob Android multimedia player designed for an upgraded in-car entertainment experience.",
      specifications: [
        "Model: NAM5710-A11.5",
        "Android multimedia platform",
        "Dual-knob control design",
        "Wireless CarPlay and Android Auto support",
        "8-core processor",
        "Vehicle dashboard compatibility required"
      ],
      stock: 3,
      image: ""
    },
    {
      name: "NAM5850 8-Core Android Multimedia Receiver",
      brand: "Nakamichi",
      category: "Car Monitors",
      price: 23999,
      description: "An 8-core Android multimedia receiver for compatible vehicles, designed for navigation, entertainment and connectivity.",
      specifications: [
        "Model: NAM5850",
        "8-core processor",
        "Android multimedia system",
        "Touchscreen interface",
        "Vehicle-specific installation may be required"
      ],
      stock: 3,
      image: ""
    },
    {
      name: "M7/M9 Dual-Screen Android Car Player",
      brand: "DriveONE",
      category: "Car Monitors",
      price: 34490,
      description: "A dual-screen multimedia system designed to upgrade the dashboard display and in-car entertainment experience.",
      specifications: [
        "M7/M9 product series",
        "Dual-screen display setup",
        "Android multimedia functionality",
        "CarPlay connectivity",
        "Vehicle-specific fitment required"
      ],
      stock: 2,
      image: ""
    },
  
    // =====================================
    // LIGHTING ACCESSORIES (5)
    // =====================================
    {
      name: "FNM-C4-H7 LED Headlight",
      brand: "FNM",
      category: "Lighting Accessories",
      price: 1900,
      description: "An automotive LED headlight upgrade designed for compatible H7 low-beam applications.",
      specifications: [
        "Model: FNM-C4-H7",
        "H7 bulb fitting",
        "Automotive LED chipset",
        "6500K white light",
        "IP68-rated construction",
        "15-month warranty listed by manufacturer"
      ],
      stock: 8,
      image: ""
    },
    {
      name: "FNM-C7-H11 LED Headlight",
      brand: "FNM",
      category: "Lighting Accessories",
      price: 3700,
      description: "A high-output LED lighting option designed for compatible H11 headlight or fog-light applications.",
      specifications: [
        "Model: FNM-C7-H11",
        "H11 bulb fitting",
        "140W per pair (manufacturer specification)",
        "32,000 lumens per pair (manufacturer specification)",
        "6500K white light",
        "IP68-rated construction",
        "15-month warranty listed by manufacturer"
      ],
      stock: 6,
      image: ""
    },
    {
      name: "FNM-C4-H11 LED Fog Light",
      brand: "FNM",
      category: "Lighting Accessories",
      price: 1900,
      description: "An LED lighting option for compatible H11 fog-light applications, designed for improved road illumination.",
      specifications: [
        "Model: FNM-C4-H11",
        "H11 bulb fitting",
        "90W per pair (manufacturer specification)",
        "20,000 lumens per pair (manufacturer specification)",
        "6500K white light",
        "IP68-rated construction"
      ],
      stock: 8,
      image: ""
    },
    {
      name: "FNM-S2-H11 LED Fog Light",
      brand: "FNM",
      category: "Lighting Accessories",
      price: 1000,
      description: "A compact LED fog-light option for compatible H11 vehicle fittings.",
      specifications: [
        "Model: FNM-S2-H11",
        "H11 bulb fitting",
        "Automotive LED lighting",
        "Vehicle socket compatibility required",
        "Professional installation recommended"
      ],
      stock: 10,
      image: ""
    },
    {
      name: "Novsight A500-N12-H3 LED Fog Light",
      brand: "Novsight",
      category: "Lighting Accessories",
      price: 1500,
      description: "An LED fog-light option designed for compatible H3 automotive fittings.",
      specifications: [
        "Model: A500-N12-H3",
        "H3 bulb fitting",
        "Automotive LED light source",
        "Check vehicle voltage and socket",
        "Pair compatibility should be confirmed"
      ],
      stock: 7,
      image: ""
    },
  
    // =====================================
    // EXTERIOR ACCESSORIES (5)
    // =====================================
    {
      name: "Chrome Side Mirror Cover Pair",
      brand: "MotoGT Select",
      category: "Exterior Accessories",
      price: 2400,
      description: "Decorative chrome-finish mirror covers designed to enhance the exterior appearance of compatible vehicles.",
      specifications: [
        "Pair of two mirror covers",
        "Chrome-style finish",
        "Exterior decorative accessory",
        "Vehicle-specific shape required",
        "Check mirror dimensions before purchase"
      ],
      stock: 8,
      image: ""
    },
    {
      name: "Window Visor Set",
      brand: "MotoGT Select",
      category: "Exterior Accessories",
      price: 2500,
      description: "A window visor set designed to help reduce rain entry and allow limited window ventilation.",
      specifications: [
        "Vehicle-specific visor set",
        "Exterior mounting design",
        "Weather-resistant material",
        "Adhesive mounting may be required",
        "Check vehicle model compatibility"
      ],
      stock: 8,
      image: ""
    },
    {
      name: "Car Door Edge Guard Set",
      brand: "MotoGT Select",
      category: "Exterior Accessories",
      price: 650,
      description: "Protective door-edge guards designed to help reduce minor paint chips and scratches.",
      specifications: [
        "Multi-piece protective set",
        "Flexible protective material",
        "Helps protect door edges",
        "Easy-fit design",
        "Universal-style accessory"
      ],
      stock: 15,
      image: ""
    },
    {
      name: "Universal Front Bumper Lip Kit",
      brand: "MotoGT Select",
      category: "Exterior Accessories",
      price: 2800,
      description: "A sporty front bumper lip accessory designed to enhance the appearance of compatible vehicle bumpers.",
      specifications: [
        "Universal-style bumper lip",
        "Flexible exterior material",
        "Sporty styling",
        "Mounting hardware may vary",
        "Professional fitting recommended"
      ],
      stock: 5,
      image: ""
    },
    {
      name: "Universal Rear Roof Spoiler",
      brand: "MotoGT Select",
      category: "Exterior Accessories",
      price: 3500,
      description: "A rear spoiler accessory designed to give compatible vehicles a sportier exterior appearance.",
      specifications: [
        "Universal-style design",
        "Exterior styling accessory",
        "Vehicle dimensions must be checked",
        "Secure mounting required",
        "Professional installation recommended"
      ],
      stock: 4,
      image: ""
    },
  
    // =====================================
    // ELECTRONICS & CAR UTILITY (5)
    // =====================================
    {
      name: "M310 Plus 3K Car Dash Camera",
      brand: "70mai",
      category: "Electronics & Car Utility",
      price: 6495,
      description: "A compact dash camera designed to record driving footage with G-sensor support for incident detection.",
      specifications: [
        "Model: M310 Plus",
        "3K video recording (listed variant)",
        "G-sensor support",
        "Day and night recording",
        "Memory card compatibility should be checked"
      ],
      stock: 5,
      image: ""
    },
    {
      name: "A410 2.5K HDR Dual Dash Camera",
      brand: "70mai",
      category: "Electronics & Car Utility",
      price: 11995,
      description: "A dual-channel dash camera system designed to record the road ahead and rear view.",
      specifications: [
        "Model: A410",
        "2.5K HDR front recording",
        "Front and rear camera setup",
        "Built-in speed monitoring features",
        "Parking surveillance features",
        "1-year warranty subject to seller terms"
      ],
      stock: 4,
      image: ""
    },
    {
      name: "Car Air Compressor Lite Tyre Inflator",
      brand: "70mai",
      category: "Electronics & Car Utility",
      price: 4495,
      description: "A portable electric air compressor designed to help inflate vehicle tyres when needed.",
      specifications: [
        "Portable electric tyre inflator",
        "12V car power operation",
        "Digital pressure display (variant dependent)",
        "Compact storage design",
        "Check included accessories and warranty"
      ],
      stock: 6,
      image: ""
    },
    {
      name: "TPMS Lite 2 Smart Tyre Pressure Monitoring System",
      brand: "70mai",
      category: "Electronics & Car Utility",
      price: 8495,
      description: "A tyre pressure monitoring system designed to help drivers monitor tyre pressure and temperature.",
      specifications: [
        "Model: Lite 2 T05",
        "Four external sensors",
        "Solar charging",
        "Tyre pressure monitoring",
        "Tyre temperature monitoring",
        "Vehicle compatibility required"
      ],
      stock: 4,
      image: ""
    },
    {
      name: "335 67W 3-Port Car Charger",
      brand: "Anker",
      category: "Electronics & Car Utility",
      price: 1999,
      description: "A multi-port car charger designed to charge compatible mobile devices and accessories while travelling.",
      specifications: [
        "Model: Anker 335",
        "67W maximum output (product listing)",
        "3 charging ports",
        "Multi-device charging",
        "USB cable sold separately unless included"
      ],
      stock: 8,
      image: ""
    }
  ];
  
  module.exports = motoGTProducts;
  