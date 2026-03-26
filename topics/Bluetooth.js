// topics/bluetooth.js

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(

  // ── BLE Fundamentals ──────────────────────────────────────────────────────
  {
    topic: "Bluetooth",
    q: "What does BLE stand for?",
    opts: ["Bluetooth Low Energy", "Bluetooth Low Efficiency", "Bluetooth Long Engagement", "Basic Link Encryption"],
    ans: 0,
    exp: "BLE stands for Bluetooth Low Energy — a wireless technology designed for short-range communication with significantly reduced power consumption compared to Classic Bluetooth."
  },
  {
    topic: "Bluetooth",
    q: "Which feature distinguishes BLE from Classic Bluetooth?",
    opts: ["Higher data transfer rates.", "Longer range.", "Lower energy consumption.", "Better audio quality."],
    ans: 2,
    exp: "BLE is specifically engineered for lower energy consumption, making it ideal for battery-powered IoT devices. Classic Bluetooth prioritises continuous data streaming (e.g. audio)."
  },
  {
    topic: "Bluetooth",
    q: "BLE is particularly designed for:",
    opts: ["Long-distance communication.", "Short-range, low-power communication.", "Audio streaming.", "High-speed data transfer."],
    ans: 1,
    exp: "BLE is optimised for short-range, low-power communication — perfect for IoT sensors, wearables, and devices that send small, infrequent bursts of data."
  },
  {
    topic: "Bluetooth",
    q: "Which of the following supports low energy radio operation.",
    opts: ["WiFi", "BLE", "Bluetooth", "HaLow"],
    ans: 1,
    exp: "BLE (Bluetooth Low Energy) is specifically designed for low energy radio operation, unlike Classic Bluetooth, WiFi, or HaLow which consume more power."
  },
  {
    topic: "Bluetooth",
    q: "Which version of Bluetooth introduced BLE?",
    opts: ["Bluetooth 2.0", "Bluetooth 3.0", "Bluetooth 5.0", "Bluetooth 4.0"],
    ans: 3,
    exp: "BLE was introduced in Bluetooth 4.0 (released in 2010), which added the Low Energy mode alongside the Classic Bluetooth radio."
  },
  {
    topic: "Bluetooth",
    q: "Which frequency band does BLE operate in?",
    opts: ["915 MHz", "5.0 GHz", "433 MHz", "2.4 GHz", "868 MHz"],
    ans: 3,
    exp: "BLE operates in the 2.4 GHz ISM band, using 40 channels of 2 MHz each across the 2.4–2.4835 GHz range."
  },
  {
    topic: "Bluetooth",
    q: "What is the maximum data rate of latest BLE?",
    opts: ["2 Mbps", "3 Mbps", "4 Mbps5", "1 Mbps"],
    ans: 0,
    exp: "The latest BLE (Bluetooth 5.x) supports a maximum data rate of 2 Mbps using the LE 2M PHY mode."
  },
  {
    topic: "Bluetooth",
    q: "What is the range typically achievable with BLE technology?",
    opts: ["Up to 150 meters", "Up to 10 meters", "Up to 100 meters", "Up to 50 meters"],
    ans: 2,
    exp: "BLE typically achieves a range of up to 100 meters in open space, though real-world range varies based on obstacles and transmission power."
  },

  // ── BLE Topology & Roles ──────────────────────────────────────────────────
  {
    topic: "Bluetooth",
    q: "BLE supports which kind of communication topology?",
    opts: ["Star", "Mesh", "Point-to-Point", "Bus"],
    ans: [0, 1, 2],
    exp: "BLE supports Star (one central, many peripherals), Mesh (many-to-many), and Point-to-Point topologies. Bus topology is not supported."
  },
  {
    topic: "Bluetooth",
    q: "Which of the following Topology does Bluetooth 4.0 support?",
    opts: ["Mesh", "Scatter Net", "Star", "Ring"],
    ans: [1, 2],
    exp: "Bluetooth 4.0 supports Scatter Net (multiple piconets linked together) and Star topologies. Mesh was added in later versions; Ring is not a Bluetooth topology."
  },
  {
    topic: "Bluetooth",
    q: "In BLE, what is the role of a 'Central' device?",
    opts: [
      "It acts as an intermediary between two devices.",
      "It only receives data.",
      "It connects to and controls peripheral devices.",
      "It broadcasts data to peripheral devices."
    ],
    ans: 2,
    exp: "A Central device in BLE initiates connections and controls peripheral devices — similar to a master role. It scans for advertising packets and establishes connections."
  },

  // ── BLE Protocols & Modes ─────────────────────────────────────────────────
  {
    topic: "Bluetooth",
    q: "In BLE terminology, what is a 'GATT'?",
    opts: [
      "Generic Attribute Profile",
      "Generic Authentication Transfer Tool",
      "Generic Access Transmission Technique",
      "Generic Audio Transmission Technology"
    ],
    ans: 0,
    exp: "GATT stands for Generic Attribute Profile — it defines how BLE devices communicate data using a structured hierarchy of Services and Characteristics."
  },
  {
    topic: "Bluetooth",
    q: "What does 'Pairing' in BLE involve?",
    opts: [
      "Adjusting the power level for optimal connection.",
      "Connecting two devices for data transfer.",
      "Broadcasting data to multiple devices.",
      "Exchanging security keys for secure communication."
    ],
    ans: 3,
    exp: "Pairing in BLE involves exchanging and storing security keys (via SMP — Security Manager Protocol) to establish a secure, encrypted communication channel between devices."
  },
  {
    topic: "Bluetooth",
    q: "What is a characteristic of BLE 'Advertising' mode?",
    opts: [
      "Long-range communication.",
      "Secure data encryption.",
      "Device discovery and connection establishment.",
      "High data transfer rate."
    ],
    ans: 2,
    exp: "In BLE Advertising mode, a peripheral broadcasts small packets on advertising channels so that Central devices can discover it and initiate a connection."
  },
  {
    topic: "Bluetooth",
    q: "Which of the following scheme is used by Bluetooth?",
    opts: [
      "VWXYZ scheme",
      "Frequency hopping TDD scheme",
      "DSSS TDD scheme",
      "DSSS FDD scheme",
      "Frequency hopping FDD scheme",
      "Pyramid scheme",
      "ABCDEFG scheme"
    ],
    ans: 1,
    exp: "Bluetooth uses Frequency Hopping Spread Spectrum (FHSS) combined with Time Division Duplex (TDD), hopping across 79 channels at 1600 hops/second."
  },

  // ── Channels & Calculations ───────────────────────────────────────────────
  {
    topic: "Bluetooth",
    q: "Bluetooth is designed for short broadcast. There are forty 2-Mhz channels. How many of these channels are reserved for advertising? (enter numerical number)",
    type: "input",
    ans: "3",
    exp: "Out of BLE's 40 channels (2 MHz each), 3 are reserved for advertising (channels 37, 38, 39). The remaining 37 are data channels."
  },
  {
    topic: "Bluetooth",
    q: "If the number of carrier frequencies is equal to 25, how many outputs bits must be generated by the PRN generator? (Assume FHSS)",
    type: "input",
    ans: "5 bits",
    exp: "To address 25 carrier frequencies, the PRN generator needs ⌈log₂(25)⌉ = ⌈4.64⌉ = 5 bits."
  },
  {
    topic: "Bluetooth",
    q: "If the bandwidth of the spread spectrum signal is 180MHz and the signal bandwidth is 15MHz. How many carrier frequencies are required for generating the spread spectrum signal?",
    type: "input",
    ans: "12",
    exp: "Number of carrier frequencies = Total spread spectrum bandwidth ÷ Signal bandwidth = 180 ÷ 15 = 12."
  },
  {
    topic: "Bluetooth",
    q: "Assume Bob can send 300 bits in one slot while using Bluetooth. How many slots does it take to send 1200 bits?",
    type: "input",
    ans: "4",
    exp: "Slots required = Total bits ÷ Bits per slot = 1200 ÷ 300 = 4 slots."
  },
  {
    topic: "Bluetooth",
    q: "If the hopping time, assuming FHSS, is equal to 500μs, how many times would the signal hopped in one second? (you can select more than one option)",
    opts: ["2500", "1750", "2250", "1500", "2000"],
    ans: [1, 3, 4],
    exp: "1 second = 1,000,000μs. With a 500μs dwell time, hops = 1,000,000 ÷ 500 = 2000 hops/s. The quiz also accepts 1750 and 1500 as valid answers."
  },

);
