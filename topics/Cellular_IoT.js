// topics/cellular_iot.js

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(

  // ── NB-IoT Fundamentals ────────────────────────────────────────────────────
  {
    topic: "Cellular IoT",
    q: "Which of the following IoT applications is best suited for NB-IoT?",
    opts: ["Real-time video streaming", "Wearable fitness trackers", "High-speed asset tracking", "Smart metering in rural areas"],
    ans: 3,
    exp: "NB-IoT excels at low-power, low-data-rate applications in hard-to-reach areas. Smart metering in rural areas fits perfectly — it sends small, infrequent data from locations with poor coverage."
  },
  {
    topic: "Cellular IoT",
    q: "Which of the following is NOT a feature of NB-IoT?",
    opts: ["Extended Coverage", "Extended Idle Mode", "High Receiver Sensitivity", "Long Battery Life"],
    ans: 2,
    exp: "NB-IoT features include Extended Coverage, Extended Idle Mode (PSM/eDRX), and Long Battery Life. High Receiver Sensitivity is not listed as a distinct NB-IoT feature — it is coverage enhancement that is already covered under Extended Coverage."
  },
  {
    topic: "Cellular IoT",
    q: "Which of the following is a key advantage of NB-IoT over traditional cellular networks?",
    opts: ["High Data Rates", "Low Power Consumption", "Wide Coverage Area", "High Reliability"],
    ans: 1,
    exp: "NB-IoT is specifically designed for low power consumption, enabling IoT devices to run on batteries for years — a critical advantage over traditional cellular networks."
  },
  {
    topic: "Cellular IoT",
    q: "NB-IoT is introduced in which of the following standards?",
    opts: ["LTE – Advanced Pro", "LTE – NB Advanced", "LTE", "LTE – Advanced"],
    ans: 0,
    exp: "NB-IoT was standardised by 3GPP in Release 13, which corresponds to LTE-Advanced Pro."
  },
  {
    topic: "Cellular IoT",
    q: "Which of the following organizations is responsible for the development of NB-IoT standards?",
    opts: ["IEEE", "Wi-Fi Alliance", "3GPP", "IETF"],
    ans: 2,
    exp: "NB-IoT is standardised by 3GPP (3rd Generation Partnership Project), the same body that defines LTE and 5G standards."
  },
  {
    topic: "Cellular IoT",
    q: "Which of the following is NOT a mode of operations for NB-IoT?",
    opts: ["Guard band", "Stand Alone", "Out-Band", "In-Band"],
    ans: 2,
    exp: "NB-IoT operates in three modes: In-Band (within LTE spectrum), Guard Band (in LTE guard bands), and Stand Alone (dedicated spectrum). Out-Band is not a valid NB-IoT deployment mode."
  },
  {
    topic: "Cellular IoT",
    q: "Which network element is responsible for interfacing NIDD with IoT application servers in NB-IoT?",
    opts: ["MME", "S-GW", "EPC", "SCEF"],
    ans: 3,
    exp: "The SCEF (Service Capability Exposure Function) provides a secure interface to expose 3GPP network services, including NIDD (Non-IP Data Delivery), to IoT application servers."
  },
  {
    topic: "Cellular IoT",
    q: "Why is NIDD particularly suitable for NB-IoT?",
    opts: [
      "It supports high-bandwidth applications",
      "It uses a broadcast communication model",
      "It allows direct device-to-device communication",
      "It eliminates IP overhead, optimizing for small data packets"
    ],
    ans: 3,
    exp: "NIDD (Non-IP Data Delivery) bypasses the IP stack entirely, reducing overhead and making it ideal for NB-IoT devices that send small, infrequent data packets."
  },
  {
    topic: "Cellular IoT",
    q: "Which of the following features of NB-IoT reduces power consumption by allowing devices to 'sleep' for extended periods?",
    opts: ["eDRX", "NIDD", "VoLTE", "PSM"],
    ans: 3,
    exp: "PSM (Power Saving Mode) allows NB-IoT devices to enter a deep sleep state for extended periods, dramatically reducing power consumption. eDRX also helps but PSM provides the longest sleep cycles."
  },
  {
    topic: "Cellular IoT",
    q: "Why is HTTP not always suitable for IoT devices?",
    opts: [
      "It is not an IP-based protocol",
      "It lacks support for small data transfers",
      "It has high overhead and power consumption",
      "It is incompatible with IoT hardware"
    ],
    ans: 2,
    exp: "HTTP has significant header overhead and requires persistent connections, leading to high power consumption — unsuitable for battery-powered IoT devices sending small amounts of data."
  },

  // ── CDMA & Modulation ──────────────────────────────────────────────────────
  {
    topic: "Cellular IoT",
    q: "Which factors determine the bit rate of a communication system?",
    opts: [
      "The noise level and the power of the transmitted signal",
      "The carrier frequency and the signal bandwidth",
      "The modulation scheme and the symbol rate",
      "The type of modulation and the size of the communication channel"
    ],
    ans: 2,
    exp: "Bit rate = symbol rate × bits per symbol. The modulation scheme determines how many bits are encoded per symbol, and the symbol rate determines how many symbols are transmitted per second."
  },
  {
    topic: "Cellular IoT",
    q: "Which of the following codes, used in CDMA, are considered orthogonal codes?",
    opts: ["<0,0,1,1> and <1,0,1,0>", "<0,1,0,1> and <1,0,1,0>", "<0,1,0,1> and <1,0,0,1>", "All of the above"],
    ans: 1,
    exp: "Two codes are orthogonal if their dot product equals zero. <0,1,0,1>·<1,0,1,0> = 0+0+0+0 = 0 ✓. The other pairs do not produce a dot product of zero."
  },
  {
    topic: "Cellular IoT",
    q: "A network manager chose to use QPSK (Quadrature Phase Shift Keying) as the modulation scheme for an NB-IoT network. How many bits can an NB-IoT device transmit at any given point in time? (Select only the possible option)",
    opts: ["None of the above", "Only one bit", "Two bits", "Three bits", "All of the above"],
    ans: 0,
    exp: "In NB-IoT, QPSK is used but the device transmits on a single narrow subcarrier at a time. The number of bits transmitted at any instant depends on the specific NB-IoT mode and resource allocation — none of the listed options is definitively correct as a standalone answer."
  },

  // ── Bandwidth Calculations ─────────────────────────────────────────────────
  {
    topic: "Cellular IoT",
    q: "Assume that you are a network operator, and you chose to implement TDMA as the multiple access scheme. How much bandwidth is required to support 10 users if each user requires a bandwidth equal to 400kHz. Assume that the bandwidth of the guard band on each side of the spectrum must be equal to 50kHz.",
    opts: ["4100kHz", "400kHz", "500kHz", "4000kHz"],
    ans: 2,
    exp: "In TDMA, all users share one channel in time slots. Total bandwidth = 400kHz (channel) + 50kHz + 50kHz (guard bands) = 500kHz."
  },
  {
    topic: "Cellular IoT",
    q: "Assume that you are a network operator, and you allocated a frequency spectrum of bandwidth equal to 1000kHz for carrying out 4G cellular operation. How many subcarriers (maximum) can you support given the above bandwidth. Assume that the bandwidth of the guard band on each side of the spectrum must be equal to 50kHz.",
    opts: ["60", "50", "70", "40"],
    ans: 0,
    exp: "Usable bandwidth = 1000 − 50 − 50 = 900kHz. Number of subcarriers = 900 ÷ 15 = 60."
  },
  {
    topic: "Cellular IoT",
    q: "Assume that you are a network operator, and you are allocated a frequency spectrum of bandwidth equal to 1000kHz for carrying out cellular operation. You chose to implement FDMA as the multiple access scheme. How many users can you support if each user requires a bandwidth equal to 40 kHz. Assume that the bandwidth of the guard band on each side of the spectrum must be equal to 50kHz.",
    opts: ["23", "24", "22", "25"],
    ans: 2,
    exp: "Usable bandwidth = 1000 − 50 − 50 = 900kHz. Users supported = floor(900 ÷ 40) = floor(22.5) = 22."
  },
  {
    topic: "Cellular IoT",
    q: "Assume that the subcarrier band size has been increased from 15kHz to 25kHz. Using this information, calculate how much would be the bandwidth of one physical resource block? Select which of the following is the answer:",
    opts: ["500kHz", "375kHz", "250kHz", "300kHz"],
    ans: 3,
    exp: "One physical resource block = 12 subcarriers. Bandwidth = 12 × 25kHz = 300kHz."
  },
  {
    topic: "Cellular IoT",
    q: "Assume NB-IoT scenario and calculate the minimum transmit power (dBm) for a link budget equal to 170dB and a receiver sensitivity of −150dBm. Enter the numerical number only in dBm.",
    type: "input",
    ans: "20",
    exp: "Link Budget = Tx Power − Rx Sensitivity. So Tx Power = Link Budget + Rx Sensitivity = 170 + (−150) = 20 dBm."
  },

  // ── True/False & Statement Analysis ───────────────────────────────────────
  {
    topic: "Cellular IoT",
    q: "Statement A: NB-IoT devices are not suitable for indoor placement due to insufficient coverage. \nStatement B: NB-IoT devices rely on coverage provided by LTE and 5G-NR cellular technologies. \nWhich is correct?",
    opts: [
      "Statement B is true, but Statement A is false.",
      "Statements A and B are true. They are independent of each other.",
      "Statement A is true, but Statement B is false.",
      "Statements A and B are true. Statement B explains Statement A."
    ],
    ans: 0,
    exp: "Statement B is true — NB-IoT does rely on LTE/5G-NR coverage. Statement A is false — NB-IoT actually has enhanced indoor penetration due to its extended coverage features."
  },
  {
    topic: "Cellular IoT",
    q: "Statement A: NB-IoT requires the device to connect to an operator network via licensed or unlicensed spectrum. The spectrum in which the devices are transmitting information does not matter if the eNodeB (i.e., the 4G cellular tower) is aware of the same.  \nStatement B: Unlike normal LTE devices, NB-IoT devices need not listen to paging regularly. In fact, it is okay even if these devices do not listen to paging for a whole day as well.  \nWhich is correct?",
    opts: [
      "Statements A and B are true.",
      "Statement A is true, but Statement B is false.",
      "Both Statements are false.",
      "Statement B is true, but Statement A is false."
    ],
    ans: 2,
    exp: "Both statements are false. NB-IoT operates only on licensed spectrum, and while PSM reduces paging frequency, there are still specific paging requirements devices must follow."
  },
  {
    topic: "Cellular IoT",
    q: "Statement A: Any mobile on a 4G network can move while retaining an active connection. \nStatement B: As NB-IoT devices rely on 4G coverage, they can also move while maintaining an active connection. \nWhich is correct?",
    opts: [
      "Statements A and B are true. They are independent of each other.",
      "Both Statements are false.",
      "Statements A and B are true. Statement B is the perfect explanation for Statement A.",
      "Statement B is true, but Statement A is false.",
      "Statement A is true, but Statement B is false."
    ],
    ans: 4,
    exp: "Statement A is true — 4G supports mobility with handovers. Statement B is false — NB-IoT is designed for stationary devices and does not support seamless mobility/handovers like standard LTE."
  },

);
