// topics/coap_mqtt.js

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(

  // ── CoAP Basics ────────────────────────────────────────────────────────────
  {
    topic: "CoAP & MQTT",
    q: "What does CoAP stand for?",
    opts: ["Common Application Protocol", "Constrained Application Protocol", "Compact Application Protocol", "Control Application Protocol"],
    ans: 1,
    exp: "CoAP stands for Constrained Application Protocol — designed for use in constrained environments like IoT devices."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP provides which of the following requirements?",
    opts: ["Multicast support, lower overhead and simplicity", "Multicast support and simplicity", "Lower overhead and multicast support", "Simplicity and low overhead"],
    ans: 0,
    exp: "CoAP provides multicast support, lower overhead, and simplicity — making it suitable for constrained IoT environments."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP is specialized in?",
    opts: ["Wired applications", "Device applications", "Internet applications", "Wireless applications"],
    ans: 2,
    exp: "CoAP is specialized in Internet applications, adapted for machine-to-machine communication in IoT contexts."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP is a specialised _______ protocol.",
    opts: ["Resource", "Power", "Web transfer", "Application"],
    ans: 3,
    exp: "CoAP is a specialised Application layer protocol designed for constrained nodes and networks."
  },
  {
    topic: "CoAP & MQTT",
    q: "Which layer is CoAP?",
    opts: ["Control layer", "Service layer", "Application layer", "Transport layer"],
    ans: 2,
    exp: "CoAP operates at the Application layer, sitting on top of UDP at the transport layer."
  },
  {
    topic: "CoAP & MQTT",
    q: "What transport layer protocol does CoAP use?",
    opts: ["ICMP", "UDP", "TCP", "REST"],
    ans: 1,
    exp: "CoAP uses UDP (User Datagram Protocol) as its transport layer, keeping overhead low for constrained devices."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP is designed for which kind of networks?",
    opts: ["Resource-constrained networks", "Datacenter Networks", "Local Area Networks (LAN)", "Wide Area Networks (WAN)"],
    ans: 0,
    exp: "CoAP is specifically designed for resource-constrained networks, such as those found in IoT deployments."
  },
  {
    topic: "CoAP & MQTT",
    q: "Which protocol is CoAP closely modeled after?",
    opts: ["HTTP", "AMQP", "FTP", "MQTT"],
    ans: 0,
    exp: "CoAP is closely modeled after HTTP, sharing concepts like methods (GET, POST, PUT, DELETE) and response codes."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP supports which of the following methods similar to HTTP?",
    opts: ["OPTIONS, HEAD", "None of them", "GET, POST, PUT, DELETE", "CONNECT, TRACE, PATCH"],
    ans: 2,
    exp: "CoAP supports GET, POST, PUT, and DELETE — the same core methods as HTTP — adapted for constrained environments."
  },
  {
    topic: "CoAP & MQTT",
    q: "The core of the CoAP protocol is specified in ______?",
    opts: ["RFC 7452", "RFC 7524", "RFC 7254", "RFC 7252"],
    ans: 3,
    exp: "The core CoAP specification is defined in RFC 7252."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP messages can be of which types?",
    opts: ["Synchronous and Asynchronous", "Persistent and Transient", "Request and Response", "Confirmable and Non-Confirmable"],
    ans: 3,
    exp: "CoAP messages are either Confirmable (require acknowledgement) or Non-Confirmable (fire-and-forget)."
  },
  {
    topic: "CoAP & MQTT",
    q: "CoAP Protocol is comprised of which sub-layers?",
    opts: ["UDP", "Request & Response", "Message", "Observation"],
    ans: [1, 2],
    exp: "CoAP is comprised of the Request & Response sub-layer and the Message sub-layer."
  },
  {
    topic: "CoAP & MQTT",
    q: "Select the TRUE statement(s) for CoAP protocol.",
    opts: [
      "Uses PUT message requests to create subscription.",
      "Uses GET message requests to retrieve subscription.",
      "Uses FETCH message requests to retrieve subscription.",
      "Uses PUSH message requests to create subscription."
    ],
    ans: [0, 1],
    exp: "CoAP uses PUT to create a subscription and GET to retrieve a subscription — mirroring HTTP semantics."
  },

  // ── MQTT Basics ────────────────────────────────────────────────────────────
  {
    topic: "CoAP & MQTT",
    q: "What does MQTT stand for?",
    opts: ["Message Querying Telecommunication Transmission", "Message Quorum Transport Technology", "Message Queuing Telemetry Transport", "Message Queuing Transaction Transport"],
    ans: 2,
    exp: "MQTT stands for Message Queuing Telemetry Transport — a lightweight publish/subscribe messaging protocol."
  },
  {
    topic: "CoAP & MQTT",
    q: "What type of protocol is MQTT?",
    opts: ["Presentation protocol", "Network protocol", "Transport protocol", "Application protocol"],
    ans: 3,
    exp: "MQTT is an Application layer protocol designed for lightweight machine-to-machine messaging."
  },
  {
    topic: "CoAP & MQTT",
    q: "MQTT is _______ oriented.",
    opts: ["Data", "Message", "Network", "Device"],
    ans: 1,
    exp: "MQTT is message-oriented — communication is structured around discrete messages sent through a broker."
  },
  {
    topic: "CoAP & MQTT",
    q: "What is the default port number for MQTT?",
    opts: ["8080", "8883", "80", "1883"],
    ans: 3,
    exp: "The default MQTT port is 1883 (unencrypted). Port 8883 is used for MQTT over TLS/SSL."
  },
  {
    topic: "CoAP & MQTT",
    q: "MQTT uses the publish/subscribe model. How does the publisher know who is subscribing?",
    opts: [
      "The publisher gets notified when they subscribe.",
      "Publisher uses the \"Eye of Sauron\"",
      "The subscriber informs the publisher",
      "The publisher doesn't know"
    ],
    ans: 3,
    exp: "In MQTT's publish/subscribe model, publishers and subscribers are fully decoupled — the publisher has no knowledge of who is subscribing."
  },
  {
    topic: "CoAP & MQTT",
    q: "MQTT transmits data to and from a broker in which format? (Choose the best option)",
    opts: ["Text based data", "XML", "Binary data", "JSON"],
    ans: 2,
    exp: "MQTT transmits data in binary format, keeping message payloads small and efficient for constrained devices."
  },
  {
    topic: "CoAP & MQTT",
    q: "What is a topic in MQTT?",
    opts: ["A message payload", "A string used to filter messages in a publish/subscribe model", "A client identifier", "A unique identifier for a message"],
    ans: 1,
    exp: "A topic in MQTT is a UTF-8 string used to filter and route messages between publishers and subscribers via the broker."
  },
  {
    topic: "CoAP & MQTT",
    q: "Which of the following is not a client type in MQTT?",
    opts: ["Producer", "Subscriber", "Broker", "Publisher"],
    ans: 0,
    exp: "MQTT clients are Publishers and Subscribers. The Broker is the server that routes messages. 'Producer' is not an MQTT client type."
  },
  {
    topic: "CoAP & MQTT",
    q: "Which of the following is NOT a characteristic of MQTT?",
    opts: ["Publish/subscribe messaging model", "Request/response messaging model", "Quality of Service (QoS)", "Low overhead"],
    ans: 1,
    exp: "MQTT uses a publish/subscribe model, not request/response. Request/response is characteristic of HTTP and CoAP."
  },
  {
    topic: "CoAP & MQTT",
    q: "What is the maximum number of clients that can subscribe to a single topic in MQTT?",
    opts: ["1", "100", "10", "Unlimited"],
    ans: 3,
    exp: "MQTT allows an unlimited number of clients to subscribe to any given topic."
  },
  {
    topic: "CoAP & MQTT",
    q: "Which of the following QoS levels in MQTT ensures message delivery at least once?",
    opts: ["None of them.", "QoS 0", "QoS 2", "QoS 1"],
    ans: 3,
    exp: "QoS 1 guarantees at-least-once delivery. QoS 0 is fire-and-forget, and QoS 2 ensures exactly-once delivery."
  },
  {
    topic: "CoAP & MQTT",
    q: "To receive a retained message?",
    opts: [
      "You must subscribe with a QOS of 1 or 2",
      "You must subscribe with the retained message set.",
      "You must keep the message.",
      "You must subscribe to a topic that has been published with the retained message set."
    ],
    ans: 3,
    exp: "To receive a retained message, a client must subscribe to a topic where a message has already been published with the retained flag set."
  },
  {
    topic: "CoAP & MQTT",
    q: "The Last Will Message in MQTT is used to:",
    opts: [
      "Notify clients of a failure in the publisher",
      "Guarantee that the message was delivered",
      "Gain inheritance",
      "Notify a publisher of a network failure"
    ],
    ans: 0,
    exp: "The Last Will and Testament (LWT) message is published by the broker to notify other clients when a publisher disconnects unexpectedly."
  },

);
