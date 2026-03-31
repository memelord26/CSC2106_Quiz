// topics/HTTP_&_REST.js

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(
  {
    topic: "HTTP & REST",
    q: "Which HTTP status code indicates a successful GET request in a RESTful API?",
    opts: ["400 Bad Request", "201 Created", "500 Internal Server Error", "200 OK"],
    ans: 3,
    exp: "200 OK is the standard response for a successful HTTP request. 201 is for resource creation, 400 for bad requests, and 500 for server errors."
  },
  {
    topic: "HTTP & REST",
    q: "What does REST stand for?",
    opts: ["Relative State Transmission", "Representational State Transfer", "Real-time State Transfer", "Remote Server Transaction"],
    ans: 1,
    exp: "REST stands for Representational State Transfer — an architectural style for designing networked applications."
  },
  {
    topic: "HTTP & REST",
    q: "Which of the following HTTP methods is used to retrieve a resource in RESTful architecture?",
    opts: ["POST", "PUT", "GET", "DELETE"],
    ans: 2,
    exp: "GET is used to retrieve/read a resource. POST creates, PUT updates, and DELETE removes resources."
  },
  {
    topic: "HTTP & REST",
    q: "What type of architecture does RESTful APIs follow?",
    opts: ["Client-server architecture", "Microservices architecture", "Peer-to-peer architecture", "Monolithic architecture", "Publisher-Subscriber architecture"],
    ans: 0,
    exp: "RESTful APIs follow a client-server architecture, where the client and server are separate and communicate over HTTP."
  },
  {
    topic: "HTTP & REST",
    q: "What is the primary role of a RESTful API's Uniform Interface constraint?",
    opts: [
      "To ensure that the API is stateful",
      "To separate client and server implementations",
      "To define specific operations like GET and POST",
      "To standardize the way clients interact with the server"
    ],
    ans: 3,
    exp: "The Uniform Interface constraint standardises how clients interact with the server, making the API consistent and decoupled from implementation details."
  },
  {
    topic: "HTTP & REST",
    q: "What is a resource in the context of RESTful web services?",
    opts: [
      "A set of procedures for accessing a database",
      "An entity that can be accessed and manipulated through a URI",
      "A container for storing data in a web application",
      "A function that performs a specific action"
    ],
    ans: 1,
    exp: "In REST, a resource is any entity (data or service) that can be identified and accessed via a URI, such as a user or an order."
  },
  {
    topic: "HTTP & REST",
    q: "In RESTful APIs, what does a status code in the 5xx range signify?",
    opts: ["Client error", "Redirection", "Server error", "Successful operation"],
    ans: 2,
    exp: "5xx status codes indicate server-side errors (e.g. 500 Internal Server Error). 4xx = client errors, 3xx = redirections, 2xx = success."
  },
  {
    topic: "HTTP & REST",
    q: "In RESTful APIs, what is the purpose of a payload in a POST request?",
    opts: [
      "To deliver the client's request to the server",
      "To carry control information",
      "To provide additional headers",
      "To contain the data being sent by the client"
    ],
    ans: 3,
    exp: "The payload (request body) in a POST request carries the actual data the client wants to send to the server, such as a new resource to create."
  },
  {
    topic: "HTTP & REST",
    q: "What mechanism does RESTful APIs use to indicate the current state of the resource?",
    opts: ["Response body", "HTTP status codes", "API tokens", "HTTP headers"],
    ans: 1,
    exp: "HTTP status codes communicate the outcome of a request — e.g. 200 (success), 404 (not found), 201 (created) — indicating the resource's current state."
  },
  {
    topic: "HTTP & REST",
    q: "What does idempotence mean in the context of RESTful APIs?",
    opts: [
      "The API can handle asynchronous requests",
      "The API produces the same result no matter how many times the same request is made",
      "The API produces different results with each request",
      "The API encrypts data for security"
    ],
    ans: 1,
    exp: "An idempotent operation yields the same result regardless of how many times it is called. GET, PUT, and DELETE are idempotent; POST is not."
  },
  {
    topic: "HTTP & REST",
    q: "Which of the following is NOT a constraint of RESTful architecture?",
    opts: ["Cookie-based authentication", "Client-server architecture", "Statelessness", "Cacheability"],
    ans: 0,
    exp: "The six REST constraints are: client-server, statelessness, cacheability, uniform interface, layered system, and code on demand. Cookie-based authentication is not one of them."
  },
  {
    topic: "HTTP & REST",
    q: "In RESTful APIs, what is used to uniquely identify a resource?",
    opts: ["Session ID", "Query parameters", "API key", "URI (Uniform Resource Identifier)"],
    ans: 3,
    exp: "Each resource in a RESTful API is uniquely identified by a URI (e.g. /users/42). Session IDs and API keys are for authentication, not resource identification."
  },
  {
    topic: "HTTP & REST",
    q: "Which HTTP method should be used to update an existing resource in RESTful web services?",
    opts: ["GET", "PUT", "DELETE", "POST"],
    ans: 1,
    exp: "PUT replaces/updates an existing resource entirely. PATCH is used for partial updates. POST creates, GET retrieves, and DELETE removes."
  },
  {
    topic: "HTTP & REST",
    q: "What is the HTTP method used to create a new resource in RESTful architecture?",
    opts: ["GET", "PUT", "DELETE", "POST"],
    ans: 3,
    exp: "POST is used to create a new resource. The server assigns the new resource's URI and returns it (typically with a 201 Created status)."
  },
);
