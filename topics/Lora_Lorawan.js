// topics/lora_lorawan.js

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(

  // ── LoRa Basics ────────────────────────────────────────────────────────────
  {
    topic: "LoRa & LoRaWAN",
    q: "What does LoRa stand for?",
    opts: ["Long Radio", "Low Range", "Long Resonance", "Long Range"],
    ans: 3,
    exp: "LoRa stands for Long Range — it is a spread-spectrum modulation technique designed for long-range, low-power wireless communication."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "What does LoRaWAN stand for?",
    opts: ["Logical Routing WAN", "Low Range Wide Area Network", "Long Range Wide Area Network", "Low Radiation Wireless Access Network"],
    ans: 2,
    exp: "LoRaWAN stands for Long Range Wide Area Network — the MAC layer protocol and network architecture built on top of LoRa modulation."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "LoRa is primarily used for?",
    opts: ["Long-range, low-power communication", "High-speed data transmission", "Short-range communication", "Audio and video transmission"],
    ans: 0,
    exp: "LoRa is designed for long-range, low-power communication — ideal for IoT applications where devices run on batteries and transmit small amounts of data infrequently."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "What type of modulation is used in LoRa?",
    opts: ["Frequency Shift Keying (FSK)", "Phase-Shift Keying (PSK)", "Amplitude Modulation (AM)", "Chirp Spread Spectrum (CSS)"],
    ans: 3,
    exp: "LoRa uses Chirp Spread Spectrum (CSS) modulation, which encodes data using chirp signals — making it robust against interference and path loss."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "LoRa modulation is a variation of ____.",
    opts: ["Chord Spread Spectrum", "Chirp Spectrum Sector", "Chord Space Spectrum", "Chirp Spread Spectrum"],
    ans: 3,
    exp: "LoRa modulation is a proprietary variation of Chirp Spread Spectrum (CSS), developed by Semtech."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "LoRa modulation technique sits at which OSI layer?",
    opts: ["Session", "Application", "Physical", "Datalink", "Transport", "Network", "Presentation"],
    ans: 2,
    exp: "LoRa modulation operates at the Physical layer of the OSI model, defining how bits are transmitted over the radio medium."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "LoRaWAN modulation technique sits at which OSI layer?",
    opts: ["Transport", "Presentation", "Physical", "Application", "Network", "Session", "Datalink"],
    ans: 6,
    exp: "LoRaWAN, as the MAC/network protocol built on top of LoRa, sits at the Datalink layer of the OSI model."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "LoRa's spreading factor affects which of the following?",
    opts: ["Modulation technique", "Power consumption only", "Data rate and range", "Operating frequency"],
    ans: 2,
    exp: "The spreading factor (SF) in LoRa directly controls the trade-off between data rate and range — a higher SF means longer range but lower data rate."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "In LoRa, what does increasing the spreading factor (SF) do to the signal's range and data rate?",
    opts: ["Decreases both range and data rate", "Increases range and decreases data rate", "Decreases range and increases data rate", "Increases both range and data rate"],
    ans: 1,
    exp: "Increasing the SF spreads the signal over a longer time period, increasing range and noise resilience, but at the cost of a lower data rate."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "What is the main drawback of using LoRa for IoT applications?",
    opts: ["Limited data rate", "High power consumption", "Short range", "Long range"],
    ans: 0,
    exp: "LoRa's main drawback is its limited data rate (typically a few kbps), making it unsuitable for applications requiring high-bandwidth communication."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "Which Sub-GHz ISM frequency does LoRa operate in Singapore?",
    opts: ["2.4 Ghz", "466 Mhz", "923 Mhz", "868 Mhz"],
    ans: 2,
    exp: "In Singapore, LoRa operates in the 923 MHz Sub-GHz ISM band. 868 MHz is used in Europe, and 915 MHz in the US."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "What is the main advantages of using LoRa for IoT applications?",
    opts: ["Low data rate", "Long range", "Low power consumption", "High data rate"],
    ans: [1, 2],
    exp: "LoRa's main advantages are its long range (up to 15 km in rural areas) and low power consumption, making it ideal for battery-powered IoT devices that need to transmit small amounts of data over long distances."
  },

  // ── LoRaWAN Architecture & Classes ─────────────────────────────────────────
  {
    topic: "LoRa & LoRaWAN",
    q: "LoRaWAN's network server is responsible for:",
    opts: [
      "Processing and forwarding data to application servers",
      "Directly interacting with end-user applications",
      "Controlling the power output of end devices",
      "Managing the radio frequency spectrum"
    ],
    ans: 0,
    exp: "The LoRaWAN network server handles deduplication, MAC layer processing, and forwards data to the appropriate application server."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "What is the main function of the Device EUI in LoRaWAN?",
    opts: [
      "To identify the device uniquely on the network",
      "To define the device's operating frequency",
      "To specify the data rate",
      "To encrypt data"
    ],
    ans: 0,
    exp: "The Device EUI (Extended Unique Identifier) is a globally unique 64-bit identifier used to identify a LoRaWAN device on the network."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "Link Budget ...",
    opts: [
      "refers to the amount of loss that a data link (transmitter to receiver) can tolerate in order to operate properly.",
      "refers to the difference between the minimum expected power received at the receiver's end, and the receiver's sensitivity.",
      "refers to the amount of loss that a data link (transmitter to receiver) should have.",
      "refers to a connection between two entities."
    ],
    ans: 0,
    exp: "Link budget is the accounting of all gains and losses in a transmission link. It represents the maximum tolerable signal loss for the link to function correctly."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "Which class of LoRaWAN is designed for bidirectional end-devices with scheduled receive slots?",
    opts: ["Class C", "Class A", "Class D", "Class B"],
    ans: 3,
    exp: "Class B devices open scheduled receive slots (ping slots) synchronised with a network beacon, enabling predictable downlink latency."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "Which Class of LoRaWAN is best suited for applications requiring minimal latency?",
    opts: ["Class C", "Class D", "Class A", "Class B"],
    ans: 0,
    exp: "Class C devices keep their receive window open almost continuously (except when transmitting), giving the lowest possible downlink latency."
  },
  {
    topic: "LoRa & LoRaWAN",
    q: "In LoRa, which class does this end device fall under: Battery powered actuators. Energy efficient with latency controlled downlink. Slotted communication synchronized with a beacon.",
    opts: ["C", "A", "B", "D"],
    ans: 2,
    exp: "This describes Class B — battery-powered devices that use beacon-synchronised ping slots for energy-efficient, latency-controlled downlink communication."
  },

);
