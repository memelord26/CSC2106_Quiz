// topics/Intro_to_IoT_Comms.js

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(
  {
    topic: "Intro to IoT Comms",
    q: "Which of the following supports the longest range?",
    opts: ["LoRa", "ZigBee", "BLE", "WiFi"],
    ans: 0,
    exp: "LoRa supports the longest range among the given options."
  },
  {
    topic: "Intro to IoT Comms",
    q: "Devices in IoT support ... (select the best answer)",
    opts: ["All of them", "Sensing", "Data collection", "Actuating"],
    ans: 0,
    exp: "IoT devices support all of the listed functions."
  },
  {
    topic: "Intro to IoT Comms",
    q: "Which of the following is NOT a component in an IoT device?",
    opts: ["Actuator", "Sensor", "Power Supply", "Controller", "Communication"],
    ans: 2,
    exp: "Power Supply is not a component in an IoT device; it is a requirement for the device to function but not a component of the device itself."
  },
  {
    topic: "Intro to IoT Comms",
    q: "IoT refers to ... (select the best answer)",
    opts: ["Interconnections of devices in a network", "An ecosystem of devices, accessible through internet", "Exchange of data between devices in a network", "All of them"],
    ans: 3,
    exp: "IoT encompasses all of the listed aspects, making it an ecosystem of interconnected devices that exchange data and are accessible through the internet."
  },
  {
    topic: "Intro to IoT Comms",
    q: "Which of the following technology uses 2.4Ghz frequency?",
    opts: ["Z-Wave", "WiFi", "Wireless HART", "NB-IoT", "2G/3G", "Weightless", "ZigBee", "LoRa", "Bluetooth/BLE", "SigFox"],
    ans: [1, 2, 6, 7, 8],
    exp: "WiFi, Wireless HART, ZigBee, LoRa, and Bluetooth/BLE all use the 2.4Ghz frequency band."
  },
  {
    topic: "Intro to IoT Comms",
    q: "The various factors (range, power, data rate, scalability, security and cost) have the same level of importance in any IoT solution.",
    opts: ["True", "False"],
    ans: 1,
    exp: "The importance of various factors in IoT solutions can vary depending on the specific use case and requirements."
  },
  {
    topic: "Intro to IoT Comms",
    type: "match",
    q: "Match the following terms to the most appropriate description.",
    pairs: [
      { term: "Real-time Systems",              match: "focus on time constraints" },
      { term: "Embedded Systems",               match: "not necessarily connected" },
      { term: "Cyber-Physical Systems",         match: "focus on interaction between physical and cyber systems" },
      { term: "Pervasive/Ubiquitous Computing", match: "focus on anytime/anywhere computing" },
    ],
    exp: "Real-time → time constraints; Embedded → not necessarily connected; Cyber-Physical → physical/cyber interaction; Pervasive → anytime/anywhere."
  },
  {
    topic: "Intro to IoT Comms",
    q: "Which of the following allows a bunch of heterogeneous systems to communicate and interact with each other?",
    opts: ["Application", "Hardware", "Operating System", "Middleware"],
    ans: 3,
    exp: "Middleware allows different heterogeneous systems to communicate and interact with each other."
  },
  {
    topic: "Intro to IoT Comms",
    type: "match",
    q: "Arrange the various layers for the IoT Reference Model, assuming the following sequence: 7. Collaboration & Processes 6. Application",
    pairs: [
      { term: "Connectivity",              match: "2" },
      { term: "Data Abstraction",               match: "5" },
      { term: "Physical Devices & Controller",         match: "1" },
      { term: "Edge Computing", match: "3" },
      { term: "Data Accumulation", match: "4" },
    ],
    exp: "Physical Devices & Controller → 1; Connectivity → 2; Edge Computing → 3; Data Accumulation → 4; Data Abstraction → 5; Application → 6; Collaboration & Processes → 7."
  },
  {
    topic: "Intro to IoT Comms",
    q: "Which choice represents the ultimate aim for IoT?",
    opts: ["To transform raw data into insights", "To collect as much data as possible", "To connect as many 'things' together", "To reduce network bandwidth"],
    ans: 1,
    exp: "The ultimate aim for IoT is to connect as many 'things' together, enabling communication and interaction between devices to create a more interconnected and intelligent environment."
  },
);
