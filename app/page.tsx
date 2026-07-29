"use client";

import { useEffect, useMemo, useState } from "react";

const steps = [
  { id: "lesson-map", number: "01", label: "Lesson map", eyebrow: "What Lesson 1 will teach" },
  { id: "model", number: "02", label: "Your starting model", eyebrow: "Record what you think before the lesson" },
  { id: "system-overview", number: "03", label: "Seven useful views", eyebrow: "See the whole machine first" },
  { id: "hardware", number: "04", label: "Hardware", eyebrow: "Layer 1 · Physical behavior" },
  { id: "firmware", number: "05", label: "Firmware", eyebrow: "Layer 2 · Device-specific control" },
  { id: "kernel", number: "06", label: "Kernel & drivers", eyebrow: "Layer 3 · The operating-system core" },
  { id: "kernel-interface", number: "07", label: "Kernel interface", eyebrow: "Layer 4 · The protected doorway" },
  { id: "userspace", number: "08", label: "Userspace APIs", eyebrow: "Layer 5 · Convenient OS facilities" },
  { id: "python", number: "09", label: "Python runtime", eyebrow: "Layer 6 · A human-friendly machine" },
  { id: "application", number: "10", label: "Python application", eyebrow: "Layer 7 · Human intention" },
  { id: "computer-internals", number: "11", label: "Inside the computer", eyebrow: "The parts and the paths between them" },
  { id: "cpu-memory", number: "12", label: "CPU & memory", eyebrow: "Compute, remember, and store" },
  { id: "io-fundamentals", number: "13", label: "I/O fundamentals", eyebrow: "How computers exchange data" },
  { id: "buses-peripherals", number: "14", label: "Buses & peripherals", eyebrow: "PCIe, USB, interrupts, and DMA" },
  { id: "operating-systems", number: "15", label: "Operating systems", eyebrow: "A closer look · Shared control and services" },
  { id: "internet-map", number: "16", label: "The internet map", eyebrow: "How a browser reaches gmail.com" },
  { id: "web-request", number: "17", label: "Request & response", eyebrow: "DNS, HTTPS, packets, and the return journey" },
  { id: "email-system", number: "18", label: "Sending email", eyebrow: "Gmail storage, delivery, and receipt infrastructure" },
  { id: "signals", number: "19", label: "Signals to bits", eyebrow: "How physical ranges become reliable symbols" },
  { id: "patterns", number: "20", label: "Binary patterns", eyebrow: "Each added bit doubles the possibilities" },
  { id: "bytes", number: "21", label: "Bits & bytes", eyebrow: "Group binary choices into useful units" },
  { id: "logic", number: "22", label: "Logic gates", eyebrow: "Rules turn input bits into output bits" },
  { id: "half-adder", number: "23", label: "Build a half adder", eyebrow: "The smallest useful binary calculator" },
  { id: "full-adder", number: "24", label: "Build a full adder", eyebrow: "Carry one-bit arithmetic into the next place" },
  { id: "rgb", number: "25", label: "RGB pixels", eyebrow: "Store colour with three bytes" },
  { id: "meaning", number: "26", label: "Meaning & formats", eyebrow: "Interpretation gives patterns meaning" },
  { id: "reflection", number: "27", label: "Review & reflection", eyebrow: "Compare your answers with what you now know" },
] as const;

const questions = [
  "What is a computer?",
  "What do ‘ones and zeros’ actually mean?",
  "How could red, green, and blue numbers describe a colour?",
];

const samplePixels = [
  "#071116", "#071116", "#f3a64a", "#f3a64a", "#071116", "#071116",
  "#10242a", "#4ce0dc", "#f3a64a", "#f3a64a", "#4ce0dc", "#10242a",
  "#4ce0dc", "#4ce0dc", "#1a918f", "#1a918f", "#4ce0dc", "#4ce0dc",
  "#1a918f", "#1a918f", "#10242a", "#10242a", "#1a918f", "#1a918f",
];

const fullAdderRows = [
  [0, 0, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 0, 1, 0], [0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0], [1, 0, 1, 0, 1], [1, 1, 0, 0, 1], [1, 1, 1, 1, 1],
] as const;

const requestPhases = [
  {
    label: "Find an address",
    title: "DNS",
    fullName: "Domain Name System (DNS)",
    summary: "The browser asks the Domain Name System which network address currently represents gmail.com.",
    kind: "Naming protocol",
    purpose: "DNS translates a human-friendly domain name into records computers can use, including IP addresses. It is a distributed directory, not one central server.",
    journey: "Your device usually asks a recursive DNS resolver. The resolver checks its cache and, when necessary, follows the DNS hierarchy to authoritative servers for the domain.",
    gmail: "The answer directs the browser toward a suitable Google network endpoint. Cached answers make repeated lookups faster, and answers may vary by location or network conditions.",
    example: "You enter gmail.com. The browser asks a resolver for its address; the resolver returns an IP address for a nearby Google endpoint, and the browser connects to that address.",
  },
  {
    label: "Protect the conversation",
    title: "TLS",
    fullName: "Transport Layer Security (TLS)",
    summary: "The browser verifies Google’s identity and establishes encrypted keys for the conversation.",
    kind: "Security protocol",
    purpose: "TLS provides authentication, confidentiality, and integrity: the browser checks a certificate, negotiates shared keys, encrypts content, and detects tampering.",
    journey: "During the TLS handshake, the browser and server agree on security settings and create temporary session keys. Afterward, application data travels inside the protected channel.",
    gmail: "TLS helps confirm that the browser reached a server authorized for Google’s domain and prevents nearby networks from reading or silently changing the Gmail traffic.",
    example: "Before sending a sign-in cookie, the browser checks Google’s certificate and completes a handshake. The browser and server then encrypt the cookie with session keys known only to them.",
  },
  {
    label: "Ask for something",
    title: "HTTPS",
    fullName: "Hypertext Transfer Protocol Secure (HTTPS)",
    summary: "The browser sends an HTTP request through the encrypted TLS connection.",
    kind: "Application protocol over TLS",
    purpose: "HTTP defines requests and responses: methods, addresses, headers, status codes, and optional bodies. HTTPS means that HTTP exchange is protected by TLS.",
    journey: "A request identifies the resource or operation and carries headers such as accepted formats and signed-in session information. The server returns a status, headers, and data.",
    gmail: "Gmail uses many HTTPS requests to load the application, retrieve mailbox data, open messages, save drafts, and perform actions on the signed-in account.",
    example: "The browser sends an encrypted HTTP request such as “GET this mailbox view.” Gmail replies with “200 OK” plus the permitted message data, still protected inside TLS.",
  },
  {
    label: "Cross many networks",
    title: "TCP/IP",
    fullName: "Transmission Control Protocol / Internet Protocol (TCP/IP)",
    summary: "TCP organizes reliable delivery while IP addresses and routes packets across interconnected networks.",
    kind: "Transport + network protocols",
    purpose: "TCP/IP commonly refers to the internet protocol suite. IP provides addressing and routing; TCP adds a connection, ordering, retransmission of missing data, and congestion control.",
    journey: "TCP divides a byte stream into numbered segments, and IP carries them in addressed packets. Routers forward each packet one hop at a time; the receiving TCP endpoint reorders data and requests anything missing.",
    gmail: "Gmail can use HTTP over TLS and TCP, all carried by IP. Newer HTTP/3 connections use QUIC over UDP instead of TCP, but IP still handles addressing and routing.",
    example: "A large Gmail response is split into TCP segments carried inside IP packets. If one packet is lost, TCP retransmits the missing data and presents the browser with the original ordered stream.",
  },
  {
    label: "Perform the work",
    title: "Gmail services",
    fullName: "Gmail application services",
    summary: "Google’s application systems authenticate the user and retrieve permitted mailbox data.",
    kind: "System stage · not one protocol",
    purpose: "This card represents server-side application work rather than a single internet protocol. Many internal services cooperate behind Google’s public network boundary.",
    journey: "Front-end systems validate the request, identify the account, apply permissions, call application services, and read caches or distributed storage.",
    gmail: "The services return only the mailbox information and actions the authenticated account is allowed to access, while also applying safety, reliability, and policy controls.",
    example: "You select Inbox. A front-end service verifies your session, a mailbox service requests the correct message list from storage, and the result is assembled for the browser.",
  },
  {
    label: "Return the result",
    title: "Response",
    fullName: "Hypertext Transfer Protocol (HTTP) response",
    summary: "Encrypted response packets return and the browser turns received data into the interface.",
    kind: "Exchange direction · not a separate protocol",
    purpose: "A response is the answering half of HTTP, not its own protocol. It contains a status code, headers, and often a body carrying HTML, JavaScript, styles, or application data.",
    journey: "The response is encrypted by TLS, carried by TCP or QUIC, divided into IP packets, and forwarded through networks. The browser reassembles and validates the received data.",
    gmail: "The browser’s code updates the visible Gmail interface—turning structured message and mailbox data into text, controls, and pixels on the display.",
    example: "Gmail returns an HTTP status such as “200 OK,” response headers describing the data, and a body containing mailbox information. The browser uses it to draw the inbox.",
  },
] as const;

const teaSteps = [
  "Fill the kettle with water",
  "Switch the kettle on",
  "Put a teabag in a mug",
  "Pour in the hot water",
  "Wait, then remove the teabag",
];

const ladder = [
  { name: "Applications", gives: "Useful experiences", hides: "Programs, services, and devices" },
  { name: "Python & runtimes", gives: "Readable values and operations", hides: "Machine instructions" },
  { name: "Operating system", gives: "Files, processes, screens", hides: "Hardware coordination" },
  { name: "CPU, memory & storage", gives: "Calculation and remembering", hides: "Individual circuits" },
  { name: "Bits & logic gates", gives: "Reliable choices and rules", hides: "Electrical ranges" },
  { name: "Physical states", gives: "Distinguishable low/high signals", hides: "Analogue complexity" },
];

const systemLayers = [
  {
    name: "Python application",
    short: "Your program",
    provides: "The behavior and experience the programmer intends.",
    hides: "Almost every implementation detail beneath the problem being solved.",
    example: "Your source says print(\"Hello\") and describes the desired result.",
    zone: "application",
  },
  {
    name: "Python interpreter & runtime",
    short: "Python",
    provides: "Python values, objects, functions, exceptions, and automatic memory management.",
    hides: "Machine instructions, memory addresses, and most operating-system details.",
    example: "CPython finds the print function and prepares text for output.",
    zone: "runtime",
  },
  {
    name: "Userspace APIs & services",
    short: "Useful OS facilities",
    provides: "Convenient libraries and services for files, networking, windows, and processes.",
    hides: "Raw system-call conventions and platform-specific machinery.",
    example: "A standard output library turns Python’s request into bytes to be written.",
    zone: "os",
  },
  {
    name: "Kernel interface",
    short: "System calls",
    provides: "A controlled doorway through which programs request protected kernel services.",
    hides: "How each service is implemented inside the kernel.",
    example: "A write system call asks the kernel to send bytes to the terminal.",
    zone: "os",
  },
  {
    name: "Kernel & drivers",
    short: "Core operating system",
    provides: "Processes, virtual memory, filesystems, security, and controlled hardware access.",
    hides: "Scheduling, memory protection, and individual device protocols.",
    example: "The kernel schedules the process; a driver communicates with the display hardware.",
    zone: "os",
  },
  {
    name: "Firmware",
    short: "Hardware-specific control",
    provides: "Startup, configuration, and low-level control for the computer and its devices.",
    hides: "Device-specific electrical sequences and initialization rules.",
    example: "Boot firmware starts the machine; device firmware may keep running afterward.",
    zone: "physical",
  },
  {
    name: "Hardware",
    short: "The physical machine",
    provides: "Physical computation, memory, storage, input, and output.",
    hides: "Transistors, electrical timing, and continuously varying physical signals.",
    example: "Circuits change state and the display’s pixels emit light.",
    zone: "physical",
  },
] as const;

const printTrace = [
  ["1", "Python application", 'Calls print("Hello")'],
  ["2", "Python interpreter", "Turns that call into an output request"],
  ["3", "Userspace API", "Encodes the text as bytes"],
  ["4", "Kernel interface", "Requests a protected write operation"],
  ["5", "Kernel & driver", "Routes the bytes toward the terminal"],
  ["6", "Hardware", "Changes physical state; pixels emit light"],
] as const;

const codeLines = [
  { n: 1, text: "first_number = 6" },
  { n: 2, text: "second_number = 7" },
  { n: 3, text: "answer = first_number + second_number" },
  { n: 4, text: "" },
  { n: 5, text: "print(answer)" },
];

function BitLamp({ on }: { on: boolean }) {
  return <span className={`bit-lamp ${on ? "is-on" : ""}`} aria-hidden="true" />;
}

function CourseIntro({ onBegin }: { onBegin: () => void }) {
  const [selected, setSelected] = useState(0);
  const layer = systemLayers[selected];

  return (
    <main className="intro-page">
      <header className="intro-topbar">
        <div className="brand intro-brand">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>Computing</strong><small>from first principles</small></span>
        </div>
        <span className="intro-location">Course map · Lesson 01</span>
        <button className="intro-skip" onClick={onBegin}>Go To Lesson →</button>
      </header>

      <section className="intro-hero">
        <div className="intro-hero-copy">
          <p className="overline">Before Lesson 01 · Your map of the machine</p>
          <h1>How does Python become <em>physical activity?</em></h1>
          <p className="intro-lede">A single line of Python depends on layers of completed work beneath it. This lesson starts at electrical states, climbs through the operating system, and arrives at the application you experience.</p>
          <button className="intro-primary" onClick={() => document.getElementById("system-map")?.scrollIntoView({ behavior: "smooth" })}>Explore the layers <span>↓</span></button>
        </div>
        <div className="intro-orbit" aria-hidden="true">
          <span className="orbit-label orbit-app">APPLICATION</span>
          <span className="orbit-label orbit-python">PYTHON</span>
          <span className="orbit-label orbit-os">OPERATING SYSTEM</span>
          <span className="orbit-label orbit-hardware">HARDWARE</span>
          <i className="orbit-core">01</i>
        </div>
      </section>

      <section className="intro-outcomes" aria-labelledby="outcomes-title">
        <div><span>Lesson 01</span><h2 id="outcomes-title">What you’ll be able to explain</h2></div>
        <ol>
          <li><b>01</b><span><strong>Physical states become bits</strong>Digital circuits classify reliable signal ranges as 0 and 1.</span></li>
          <li><b>02</b><span><strong>Patterns gain meaning</strong>The same bits can represent numbers, text, images, sound, or instructions.</span></li>
          <li><b>03</b><span><strong>Layers manage complexity</strong>Each layer provides something useful while hiding details beneath it.</span></li>
          <li><b>04</b><span><strong>Programs change state</strong>Prediction and debugging make otherwise invisible execution observable.</span></li>
        </ol>
      </section>

      <section className="system-map" id="system-map" aria-labelledby="map-title">
        <div className="map-heading">
          <p className="overline">The abstraction ladder</p>
          <h2 id="map-title">One machine. <em>Seven useful views.</em></h2>
          <p>Select a layer. At every level, ask the same two questions: <strong>What does it provide?</strong> and <strong>what can the next layer ignore?</strong></p>
        </div>
        <div className="map-workbench">
          <div className="layer-stack" aria-label="Layers from Python application down to hardware">
            <span className="stack-direction">Closer to human intention <i>↑</i></span>
            {systemLayers.map((item, index) => (
              <div className={`layer-shell ${item.zone === "os" ? "is-os" : ""}`} key={item.name}>
                {index === 2 && <span className="os-bracket">Operating system</span>}
                <button className={`layer-button layer-${item.zone} ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)} aria-pressed={selected === index}>
                  <span>{String(systemLayers.length - index).padStart(2, "0")}</span>
                  <span><strong>{item.name}</strong><small>{item.short}</small></span>
                  <i>↗</i>
                </button>
              </div>
            ))}
            <span className="stack-direction bottom">Closer to physical behavior <i>↓</i></span>
          </div>
          <article className="layer-detail" aria-live="polite">
            <div className="detail-index">LAYER {String(systemLayers.length - selected).padStart(2, "0")}</div>
            <span className={`detail-zone zone-${layer.zone}`}>{layer.zone === "os" ? "Operating system" : layer.zone}</span>
            <h3>{layer.name}</h3>
            <dl>
              <div><dt>What it provides</dt><dd>{layer.provides}</dd></div>
              <div><dt>What it hides</dt><dd>{layer.hides}</dd></div>
            </dl>
            <div className="detail-example"><span>During print(&quot;Hello&quot;)</span><p>{layer.example}</p></div>
          </article>
        </div>
        <div className="os-note"><span>Important model</span><p><strong>The operating system is an umbrella, not one rung.</strong> It includes the kernel, its controlled interface, and facilities running in userspace. The boundaries vary between real systems; this ladder is a useful map, not a literal pipe.</p></div>
      </section>

      <section className="print-journey" aria-labelledby="journey-title">
        <div className="journey-heading">
          <p className="overline">Follow one real action</p>
          <h2 id="journey-title"><code>print(&quot;Hello&quot;)</code> travels down the ladder.</h2>
          <p>You write at the top. Each layer translates the request into terms understood by the layer beneath it. The visible result then returns to your world.</p>
        </div>
        <ol className="trace-rail">
          {printTrace.map(([number, name, description]) => <li key={number}><b>{number}</b><span><strong>{name}</strong><small>{description}</small></span></li>)}
        </ol>
        <div className="trace-result"><span>Physical result</span><code>Hello<span className="terminal-cursor">_</span></code><p>No layer did everything. Each did one part and relied on the abstractions beneath it.</p></div>
      </section>

      <section className="intro-start">
        <div><span>Ready?</span><h2>Start at the bottom: what are “ones and zeros,” really?</h2><p>Lesson 1 takes approximately 60–75 minutes. Your answers and progress stay saved on this device.</p></div>
        <button className="intro-primary" onClick={onBegin}>Begin Lesson 01 <span>→</span></button>
      </section>
    </main>
  );
}

const syllabusLessons = [
  { number: "01", title: "How can 0 and 1 make all of this?", description: "Physical states, abstraction layers, computer internals, operating systems, internet traffic, logic circuits, binary adders, RGB pixels, and representation.", status: "Available", duration: "130–165 min" },
  { number: "02", title: "A real website, reviewed line by line", description: "Walk through a static site built from scratch: HTML structure, CSS styling, JavaScript event handlers, the DOM, browser DevTools, and how a plain repository becomes a live, DNS-addressable website.", status: "Available", duration: "70–90 min" },
  { number: "03", title: "Execution, state, and debugging", description: "Precise instructions, execution flow, changing program state, debugger controls, and evidence-based investigation.", status: "Available", duration: "45–60 min" },
  { number: "04", title: "Values, variables, and state", description: "How a running program remembers information and how values change over time.", status: "Coming later", duration: "Planned" },
  { number: "05", title: "Objects, references, and memory", description: "Names, identity, mutation, copying, and an accurate model of Python objects.", status: "Coming later", duration: "Planned" },
  { number: "06", title: "Functions, scope, and the call stack", description: "Decomposition, parameters, return values, stack frames, and local state.", status: "Coming later", duration: "Planned" },
  { number: "07", title: "Collections and data structures", description: "Why lists, dictionaries, sets, and tuples exist—and how to choose between them.", status: "Coming later", duration: "Planned" },
] as const;

function Syllabus({ onOpenLesson, completedLessons }: { onOpenLesson: (lesson: 1 | 2 | 3) => void; completedLessons: number[] }) {
  return (
    <main className="syllabus-page">
      <header className="syllabus-topbar">
        <div className="brand">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>Computing</strong><small>from first principles</small></span>
        </div>
        <span>Course syllabus</span>
        <button onClick={() => onOpenLesson(1)}>Open Lesson 1 →</button>
      </header>
      <section className="syllabus-content">
        <div className="syllabus-heading">
          <p className="overline">Course map</p>
          <h1>Learn the machine, then <em>learn to program it.</em></h1>
          <p>Python is our vehicle. The real subject is how programs execute, remember, make decisions, fail, and become reliable.</p>
        </div>
        <div className="lesson-cards">
          {syllabusLessons.map((lesson, index) => {
            const lessonNumber = index + 1;
            const isCompleted = completedLessons.includes(lessonNumber);
            return (
              <article className={`lesson-card ${index < 3 ? "available" : "planned"} ${isCompleted ? "completed" : ""}`} key={lesson.number}>
                {index < 3 && <a className="lesson-card-link" href={`#lesson-${lesson.number}`} aria-label={`Open Lesson ${lesson.number}: ${lesson.title}`} onClick={(event) => { event.preventDefault(); onOpenLesson(lessonNumber as 1 | 2 | 3); }} />}
                <div className="lesson-card-top"><span>Lesson {lesson.number}</span><small>{isCompleted ? "Completed ✓" : lesson.status}</small></div>
                <div className="lesson-card-body">
                  <h2>{lesson.title}</h2>
                  <p>{lesson.description}</p>
                </div>
                <div className="lesson-card-footer"><span>{lesson.duration}</span>{index < 3 ? <span className="lesson-card-action" aria-hidden="true">{isCompleted ? "Review lesson →" : "Open lesson →"}</span> : <span>Outline placeholder</span>}</div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

const catsQuestions = [
  "What does index.html do?",
  "What does script.js do?",
  "How is this site hosted, and what makes it show up at that web address?",
];

const domTreeRows = [
  { prefix: "", tag: "<html>", note: "" },
  { prefix: "├─ ", tag: "<head>", note: "" },
  { prefix: "│  └─ ", tag: '<link rel="stylesheet">', note: "" },
  { prefix: "└─ ", tag: "<body>", note: "" },
  { prefix: "   ├─ ", tag: '<div class="darcy">', note: "" },
  { prefix: "   │  ├─ ", tag: "<h1>", note: "Hello Darcy" },
  { prefix: "   │  ├─ ", tag: "<p>", note: "This is my lovely cat!" },
  { prefix: "   │  ├─ ", tag: '<img class="darcy-photo">', note: "" },
  { prefix: "   │  └─ ", tag: '<div class="sidebar">', note: "" },
  { prefix: "   │     ├─ ", tag: '<button onclick="darcyGender()">', note: "Gender" },
  { prefix: "   │     ├─ ", tag: '<button onclick="darcyAge()">', note: "Age" },
  { prefix: "   │     ├─ ", tag: '<button onclick="darcyLikes()">', note: "Things he likes" },
  { prefix: "   │     └─ ", tag: '<p id="darcy-answer">', note: "JS writes the answer text here", target: true },
  { prefix: "   ├─ ", tag: '<div class="sheldon">', note: "…mirrors Darcy's card, ending in #sheldon-answer" },
  { prefix: "   └─ ", tag: '<script src="script.js">', note: "" },
] as const;

const cssBlocks = [
  { groups: ["opacity"], lines: ['.darcy-photo {', '  width: 100%;', '  max-width: 550px;', '  height: auto;', '  opacity: 0;', '  animation: appear 1s ease forwards;', '}'] },
  { groups: ["opacity", "duplicate"], lines: ['@keyframes appear {', '  from { opacity: 0; }', '  to   { opacity: 1; }', '}'] },
  { groups: ["flex"], lines: ['.darcy {', '  display: flex;', '  gap: 20px;', '  border: 2px solid black;', '  padding: 20px;', '  margin: 20px;', '  border-radius: 15px;', '}'] },
  { groups: ["opacity"], lines: ['.sheldon-photo {', '  width: 100%;', '  max-width: 550px;', '  height: auto;', '  opacity: 0;', '  animation: appear 1s ease forwards;', '}'] },
  { groups: ["opacity", "duplicate"], lines: ['@keyframes appear {', '  from { opacity: 0; }', '  to   { opacity: 1; }', '}'] },
  { groups: ["flex"], lines: ['.sheldon {', '  display: flex;', '  gap: 20px;', '  border: 2px solid black;', '  padding: 20px;', '  margin: 20px;', '  border-radius: 15px;', '}'] },
  { groups: ["media"], lines: ['@media (max-width: 768px) {', '  .darcy, .sheldon {', '    flex-direction: column;', '  }', '}'] },
] as const;

const catsPageSteps = [
  { number: "01", label: "Lesson map", eyebrow: "What this review will cover" },
  { number: "02", label: "Your starting model", eyebrow: "Record what you think before we start" },
  { number: "03", label: "Not programming languages", eyebrow: "Markup, presentation, and logic are different jobs" },
  { number: "04", label: "The modern web's exception", eyebrow: "Why this site has no backend" },
  { number: "05", label: "HTML walkthrough", eyebrow: "Read index.html, live site included" },
  { number: "06", label: "CSS walkthrough", eyebrow: "Every rule in style.css" },
  { number: "07", label: "JavaScript walkthrough", eyebrow: "Every function in script.js" },
  { number: "08", label: "onclick and other events", eyebrow: "Wiring HTML to JavaScript" },
  { number: "09", label: "The DOM", eyebrow: "The tree the browser actually runs on" },
  { number: "10", label: "DevTools tour", eyebrow: "Elements, Console, and Sources" },
  { number: "11", label: "Git & GitHub Pages", eyebrow: "How a repository becomes a website" },
  { number: "12", label: "server.py on a laptop", eyebrow: "Serving the same files yourself" },
  { number: "13", label: "Laptop to the internet", eyebrow: "What real deployment adds" },
  { number: "14", label: "Connecting a DNS name", eyebrow: "Tying back to Lesson 01" },
  { number: "15", label: "Explain it back", eyebrow: "Compare to what you knew before" },
] as const;

function CatsPageLesson({ onSyllabus, onComplete }: { onSyllabus: () => void; onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(3).fill(""));
  const [reflection, setReflection] = useState("");
  const [showQuirks, setShowQuirks] = useState(false);
  const [cssHoverGroup, setCssHoverGroup] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cfp-lesson-cats-page-v1") || "{}");
      if (Array.isArray(saved.completed)) setCompleted(saved.completed);
      if (Number.isInteger(saved.current)) setCurrent(Math.min(saved.current, catsPageSteps.length - 1));
      if (Array.isArray(saved.answers)) setAnswers(saved.answers);
      if (typeof saved.reflection === "string") setReflection(saved.reflection);
    } catch { /* Start fresh if saved data is malformed. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("cfp-lesson-cats-page-v1", JSON.stringify({ completed, current, answers, reflection }));
  }, [completed, current, answers, reflection]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") setCurrent((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function next() {
    const nextCompleted = completed.includes(current) ? completed : [...completed, current];
    setCompleted(nextCompleted);
    if (current === catsPageSteps.length - 1) {
      localStorage.setItem("cfp-lesson-cats-page-v1", JSON.stringify({ completed: nextCompleted, current, answers, reflection }));
      onComplete();
      return;
    }
    setCurrent((value) => Math.min(catsPageSteps.length - 1, value + 1));
  }

  const progress = Math.round((completed.length / catsPageSteps.length) * 100);

  return (
    <main className="course-shell lesson-two-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={onSyllabus} aria-label="Open the course syllabus"><span className="brand-mark"><i /><i /><i /></span><span><strong>Computing</strong><small>from first principles</small></span></button>
        <div className="course-progress" aria-label={`${progress}% of lesson complete`}><span>Lesson progress</span><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
        <button className="lesson-tag syllabus-button" onClick={onSyllabus}>Course syllabus</button>
      </header>
      <aside className="sidebar" aria-label="Lesson 2 stages">
        <div className="sidebar-intro"><span className="signal-dot" /><small>Lesson 02 · 70–90 min</small><h2>How does a real website actually work?</h2></div>
        <nav>{catsPageSteps.map((step, index) => <button key={step.number} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} onClick={() => setCurrent(index)}><span>{completed.includes(index) ? "✓" : step.number}</span><span>{step.label}<small>{step.eyebrow}</small></span></button>)}</nav>
        <div className="key-hint"><kbd>←</kbd><kbd>→</kbd><span>Move between stages</span></div>
      </aside>
      <section className="lesson cats-lesson-section" id="lesson-2">
        <div className="lesson-heading"><span className="kicker"><i /> {catsPageSteps[current].eyebrow}</span><span className="stage-count">Stage {current + 1} / {catsPageSteps.length}</span></div>

        {current === 0 && <article className="stage lesson2-map"><div><p className="overline">Lesson 02 · A real project, reviewed</p><h1>You already built <em>a real website.</em></h1><ul className="lede lede-bullets"><li>A real static site you built yourself — Darcy and Sheldon’s fan page</li><li>We’ll read every file and click the real, live buttons</li><li>Ends with how a few text files become something the whole internet can visit</li></ul><div className="lesson-promise"><span>Central question</span><p>What actually happens between writing index.html and someone else seeing it in their browser?</p></div></div><div className="lesson-outcome-panel"><span>By the end, you can</span><ol><li><b>01</b>Explain why HTML and CSS are markup, not programming</li><li><b>02</b>Read the HTML, CSS, and JS in your own project line by line</li><li><b>03</b>Explain how onclick and other event handlers connect HTML to JS</li><li><b>04</b>Describe the DOM and use browser DevTools to inspect it</li><li><b>05</b>Trace the path from a git repo to a live, DNS-addressable website</li></ol></div></article>}

        {current === 1 && <article className="stage hero-stage"><p className="overline">Before we open any files</p><h1>Explain the project <em>as it stands today.</em></h1><ul className="lede lede-bullets"><li>Use plain language and your best current understanding</li><li>Answers are saved exactly as written</li><li>You’ll compare them with what you know at the end</li></ul><div className="question-grid vertical-question-grid">{catsQuestions.map((question, index) => <label className="question-card" key={question}><span><b>0{index + 1}</b>{question}</span><textarea value={answers[index]} onChange={(event) => setAnswers((all) => all.map((answer, i) => i === index ? event.target.value : answer))} placeholder="Write your best current explanation…" /></label>)}</div><div className="principle"><span>Working rule</span><p>A specific guess is useful—even when it is wrong—because you can see exactly how your model changes.</p></div></article>}

        {current === 2 && <article className="stage"><p className="overline">Three technologies, three jobs</p><h1>HTML and CSS are not <em>programming.</em></h1><ul className="lede lede-bullets"><li>HTML describes structure — headings, paragraphs, images, buttons</li><li>CSS describes presentation — colour, spacing, layout, animation</li><li>Neither one makes decisions, stores values, or repeats work</li><li>JavaScript is the one real programming language here</li></ul><div className="concept-row"><div><b>HTML</b><p>Markup. Says what each piece of content is.</p></div><div><b>CSS</b><p>Presentation. Says how it should look.</p></div><div><b>JavaScript</b><p>Logic. Says what should happen and when.</p></div></div><div className="principle"><span>How JS gets into a page</span><p>An external file (<code>&lt;script src=&quot;script.js&quot;&gt;&lt;/script&gt;</code>), an inline <code>&lt;script&gt;</code> block written directly in the HTML, or an inline event-handler attribute like <code>onclick=&quot;darcyGender()&quot;</code>—this project actually uses two of the three.</p></div></article>}

        {current === 3 && <article className="stage"><p className="overline">The usual shape of a web app</p><h1>Most sites have a fourth piece: <em>a backend.</em></h1><ul className="lede lede-bullets"><li>HTML, CSS, and JS all run in the visitor’s browser — the &quot;frontend&quot;</li><li>Most real apps also have a &quot;backend&quot; server (Python, Node, Go, Java…)</li><li>This project’s exception: no backend at all in production</li></ul><div className="web-stack-diagram" aria-label="A typical web app: browser talking to a backend server"><div className="web-stack-box"><span className="web-stack-label">Browser</span><div className="web-stack-layer"><b>HTML</b><small>structure</small></div><div className="web-stack-layer"><b>CSS</b><small>presentation</small></div><div className="web-stack-layer"><b>JavaScript</b><small>logic</small></div></div><div className="web-stack-wire"><div className="web-stack-request"><code>fetch(&quot;/api/login&quot;)</code><i>→</i></div><div className="web-stack-request reply"><i>←</i><code>{`{ token: "..." }`}</code></div><div className="web-stack-request"><code>fetch(&quot;/api/comments&quot;)</code><i>→</i></div></div><div className="web-stack-box backend"><span className="web-stack-label">Backend server</span><div className="web-stack-layer"><b>Python / Node / Go / Java…</b><small>checks passwords, queries a database, decides what to send back</small></div></div></div><div className="lesson-promise"><span>This project’s exception</span><p>This cat page has <b>no backend at all</b> in production. There’s a <code>server.py</code> file in the repository—but it’s a local development convenience, never used by the live, deployed site. We’ll come back to exactly what it does, and what would change if it were used for real, later in this lesson.</p></div></article>}

        {current === 4 && <article className="stage"><p className="overline">The actual file, no cleanup applied</p><h1>Read index.html <em>top to bottom.</em></h1><ul className="lede lede-bullets"><li>This is the real file — no cleanup applied</li><li>Spot what’s structurally off before revealing the notes</li><li>Then try the live buttons below</li></ul><div className="bug-lab lab-panel"><div className="panel-title"><span>index.html</span><small>● live</small></div><pre>{`<!DOCTYPE html>
<html>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>My Cats</title>

    <link rel="stylesheet" href="style.css">
    <head>
        <link rel="stylesheet" href="style.css">
   </head>
   <body>
    <div class="darcy">
    <h1>Hello Darcy</h1>
    <p>This is my lovely cat!</p>
    <img src="darcy.jpg" alt="Darcy" class='darcy-photo'>
    </div>
    <div class="sidebar">
    <button onclick="darcyGender()">Gender</button>
    <button onclick="darcyAge()">Age</button>
    <button onclick="darcyLikes()">Things he likes</button>
    <p id="darcy-answer"></p>
    </div>
</div>
   <div class="sheldon">
    <h1>Hello Sheldon</h1>
    <p>This is Sheldon, the sweetest kitty</p>
    <img src="sheldon.jpg" alt="Sheldon" class="sheldon-photo">
    </div>
    <div class="sidebar">
    <button onclick="sheldonGender()">Gender</button>
    <button onclick="sheldonAge()">Age</button>
    <button onclick="sheldonLikes()">Things he likes</button>
    <p id="sheldon-answer"></p>
</div>
</div>
    <script src="script.js"></script>
   </body>
</html>`}</pre></div><button className="run-button" onClick={() => setShowQuirks(!showQuirks)}>{showQuirks ? "Hide The Notes" : "Reveal What's Structurally Off"}</button>{showQuirks && <div className="bug-answer"><b>Three real quirks</b><p><code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> appears twice—once before <code>&lt;head&gt;</code> even opens. <code>&lt;head&gt;</code> itself is opened partway down the file, after a <code>&lt;title&gt;</code> and two <code>&lt;meta&gt;</code> tags that should live inside it. And there’s one extra closing <code>&lt;/div&gt;</code> after Darcy’s sidebar that doesn’t match anything. None of this crashes the page—browsers are extremely forgiving and silently repair broken HTML using a recovery algorithm—but a browser’s repair isn’t always the structure you intended.</p></div>}<div className="cats-embed"><iframe src="https://dankokek.github.io/cats_page/" title="Live: Darcy and Sheldon's cat page" loading="lazy" /></div></article>}

        {current === 5 && <article className="stage"><p className="overline">Presentation rules</p><h1>Every rule in <em>style.css.</em></h1><div className="concept-row">
          <div className={cssHoverGroup === "opacity" ? "active" : ""} onMouseEnter={() => setCssHoverGroup("opacity")} onMouseLeave={() => setCssHoverGroup(null)}><b>opacity + animation</b><p>Photos start invisible (<code>opacity: 0</code>) and the <code>appear</code> keyframe animation fades them in over 1 second.</p></div>
          <div className={cssHoverGroup === "flex" ? "active" : ""} onMouseEnter={() => setCssHoverGroup("flex")} onMouseLeave={() => setCssHoverGroup(null)}><b>display: flex</b><p>Puts the photo and the sidebar buttons side by side inside each card.</p></div>
          <div className={cssHoverGroup === "duplicate" ? "active" : ""} onMouseEnter={() => setCssHoverGroup("duplicate")} onMouseLeave={() => setCssHoverGroup(null)}><b>Duplicated rules</b><p>Both <code>@keyframes appear</code> blocks are copy-pasted rather than shared—works fine, but it’s the same rule written twice.</p></div>
          <div className={cssHoverGroup === "media" ? "active" : ""} onMouseEnter={() => setCssHoverGroup("media")} onMouseLeave={() => setCssHoverGroup(null)}><b>@media (max-width: 768px)</b><p>Below 768px wide, both cards switch from a row to a stacked column—this is what makes the page usable on a phone.</p></div>
        </div><div className="bug-lab lab-panel"><div className="panel-title"><span>style.css</span><small>reformatted for readability · hover a card above</small></div><pre className="css-annotated">{cssBlocks.map((block, index) => <div key={index} className={`css-block ${cssHoverGroup && (block.groups as readonly string[]).includes(cssHoverGroup) ? "highlight" : ""}`}>{block.lines.join("\n")}</div>)}</pre></div></article>}

        {current === 6 && <article className="stage"><p className="overline">Real logic, six small functions</p><h1>Every function in <em>script.js.</em></h1><ul className="lede lede-bullets"><li>Six functions, one job each</li><li>Find an element by its id</li><li>Replace its text</li></ul><div className="bug-lab lab-panel"><div className="panel-title"><span>script.js</span><small>6 lines</small></div><pre>{`function darcyGender() {document.getElementById("darcy-answer").innerText="Male";}
function darcyAge() {document.getElementById("darcy-answer").innerText="2 years old";}
function darcyLikes() {document.getElementById("darcy-answer").innerText="Boxes,sleeping and treats";}
function sheldonGender() {document.getElementById("sheldon-answer").innerText = "Male";}
function sheldonAge() {document.getElementById("sheldon-answer").innerText = "1 year old";}
function sheldonLikes() {document.getElementById("sheldon-answer").innerText = "Playing, cuddles and food";}`}</pre></div><div className="principle"><span>The pattern, every time</span><p><code>document.getElementById(&quot;darcy-answer&quot;)</code> finds the exact element from the HTML with that id, and <code>.innerText = &quot;...&quot;</code> replaces whatever text is inside it. Six functions, same two steps, six different ids and strings.</p></div></article>}

        {current === 7 && <article className="stage"><p className="overline">One attribute, wiring HTML to JS</p><h1><code>onclick</code>, then <em>every other event.</em></h1><ul className="lede lede-bullets"><li><code>onclick=&quot;darcyGender()&quot;</code> wires an HTML attribute to a JS function</li><li>A click runs the named function — <code>darcyGender()</code> in script.js</li><li>That function sets <code>#darcy-answer</code>’s text to &quot;Male&quot; — nothing more</li></ul><p className="concept-row-label">Other events HTML elements can handle</p><div className="concept-row"><div><b>mouseover / mouseout</b><p>Pointer enters or leaves an element—used for hover effects and tooltips.</p></div><div><b>change</b><p>An input, select, or checkbox’s value was committed (usually on blur, not every keystroke).</p></div><div><b>submit</b><p>A form was submitted—almost always paired with <code>event.preventDefault()</code> to stop a full page reload.</p></div><div><b>keydown / keyup</b><p>A key was pressed or released—used for shortcuts and live validation.</p></div><div><b>load</b><p>An image, script, or the whole page finished loading.</p></div><div><b>DOMContentLoaded</b><p>The HTML has been fully parsed—the standard place to start JS that touches the page.</p></div></div><div className="lesson-promise"><span>The modern alternative</span><p>Inline <code>onclick=&quot;...&quot;</code> works, but mixes structure and behaviour in one attribute and only allows one handler per event. Most real code instead uses <code>element.addEventListener(&quot;click&quot;, darcyGender)</code> from within the JS file—same effect, but HTML stays pure structure and an element can listen for the same event more than once.</p></div></article>}

        {current === 8 && <article className="stage"><p className="overline">The DOM — why getElementById works at all</p><h1>The browser builds a tree called the <em>DOM.</em></h1><ul className="lede lede-bullets"><li>DOM stands for <b>Document Object Model</b></li><li>Not the HTML file — a live tree the browser builds while parsing it</li><li>JS reads and changes the tree, never the file</li><li>The browser repaints the screen to match</li></ul><div className="dom-tree" aria-label="The DOM tree the browser builds from index.html">{domTreeRows.map((row, index) => <div key={index} className={`dom-tree-row ${row.target ? "target" : ""}`}><span className="dom-tree-prefix">{row.prefix}</span><code>{row.tag}</code>{row.note && <small>{row.note}</small>}</div>)}</div><div className="concept-row"><div><b>01 · Find the node</b><p><code>document.getElementById(&quot;darcy-answer&quot;)</code> walks the tree above and returns the one highlighted node with that id.</p></div><div><b>02 · Change a property</b><p><code>.innerText = &quot;Male&quot;</code> sets a property directly on that node object — not on the HTML file, which is never touched again.</p></div><div><b>03 · Instant repaint</b><p>The browser notices the node changed and redraws just that piece of the screen — no reload, no re-fetching index.html.</p></div></div></article>}

        {current === 9 && <article className="stage debugger-controls-stage"><div><p className="overline">Tools every browser ships with</p><h1>Open DevTools and <em>look inside.</em></h1><ul className="lede lede-bullets"><li>Open the live site in another tab</li><li>Right-click any element, choose &quot;Inspect&quot; (or press F12)</li><li>Three panels matter most right now</li></ul><a className="new-tab-link" href="https://dankokek.github.io/cats_page/" target="_blank" rel="noopener noreferrer">Open the live site ↗</a></div><div className="debugger-controls"><div><kbd>⛶</kbd><b>Elements</b><p>Shows the live DOM tree, not the original HTML file—edit it here and watch the page change instantly.</p></div><div><kbd>≡</kbd><b>Console</b><p>Run JavaScript directly, or read errors and <code>console.log</code> output from script.js.</p></div><div><kbd>●</kbd><b>Sources</b><p>Open script.js here and click a line number to set a real breakpoint—exactly the skill Lesson 03 builds on next.</p></div></div></article>}

        {current === 10 && <article className="stage"><p className="overline">How this site is actually live</p><h1>A repository <em>becomes a website.</em></h1><ul className="lede lede-bullets"><li>Code lives in a GitHub repository</li><li>GitHub Pages watches the <code>main</code> branch and republishes on every push</li><li>No build step — it’s already just static files</li></ul><div className="flow-diagram" aria-label="How a git push becomes a live website"><div className="flow-step"><b>Your repo</b><small>index.html, style.css, script.js on the main branch</small></div><div className="flow-arrow">→<span>git push</span></div><div className="flow-step"><b>GitHub Pages</b><small>watches main, republishes automatically</small></div><div className="flow-arrow">→</div><div className="flow-step highlight"><b>Live website</b><small>dankokek.github.io/cats_page</small></div></div><div className="lesson-promise"><span>Worth noticing</span><p>This is the entire deployment story for this project: <code>git push</code>, and GitHub serves the files. There’s no backend, no database, no build process converting anything into anything else.</p></div></article>}

        {current === 11 && <article className="stage"><p className="overline">A different way to serve the same files</p><h1>What if <em>you</em> were the server?</h1><ul className="lede lede-bullets"><li>Not used by the live site</li><li>But it’s a real, working web server</li><li>Just running on your own laptop instead of GitHub’s infrastructure</li></ul><div className="bug-lab lab-panel"><div className="panel-title"><span>server.py</span><small>13 lines</small></div><pre>{`import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIRECTORY)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Сайт запущен на http://0.0.0.0:{PORT}/")
    print("Откройте его на другом устройстве через IP вашего компьютера")
    httpd.serve_forever()`}</pre></div><div className="concept-row"><div><b>SimpleHTTPRequestHandler</b><p>Python’s built-in &quot;hand out files from a folder&quot; web server—no framework required.</p></div><div><b>0.0.0.0:8000</b><p>Listens on port 8000, on every network interface the laptop has—not just localhost.</p></div><div><b>http://localhost:8000</b><p>Visiting this on the same laptop reaches the server directly, no network required.</p></div><div><b>Your computer’s IP</b><p>The script’s own print statement says it: another device on the same Wi-Fi can reach it too, via your laptop’s local network address instead of &quot;localhost.&quot;</p></div></div></article>}

        {current === 12 && <article className="stage"><p className="overline">From your Wi‑Fi to the whole internet</p><h1>Three things have to <em>change.</em></h1><ul className="lede lede-bullets"><li>Laptop-only reaches devices on the same local network</li><li>Going public means solving three separate problems</li></ul><div className="flow-diagram" aria-label="From a laptop running server.py to a publicly reachable site"><div className="flow-step"><b>Your laptop</b><small>python server.py on 0.0.0.0:8000</small></div><div className="flow-arrow">→<span>LAN only</span></div><div className="flow-step"><b>Home router</b><small>no public, stable address</small></div><div className="flow-arrow">→<span>rent one</span></div><div className="flow-step highlight"><b>Cloud VPS</b><small>real public IP, stays running</small></div></div><div className="concept-row"><div><b>A public address</b><p>Your laptop’s home IP isn’t stable or reachable from outside your router. You’d rent a small cloud server (a VPS) with a real public IP instead.</p></div><div><b>Staying up</b><p>Closing the terminal kills <code>python server.py</code>. A real deployment runs it as a background service that restarts itself and survives reboots.</p></div><div><b>Being production-grade</b><p><code>SimpleHTTPRequestHandler</code> is single-threaded, has no TLS (no <code>https://</code>), and was never hardened for the open internet. Real deployments put a proper web server like nginx in front of it, or—as this project actually does—skip running a server at all and use static hosting.</p></div></div></article>}

        {current === 13 && <article className="stage"><p className="overline">Back to Lesson 01: DNS</p><h1>How a <em>name</em> finds that server.</h1><ul className="lede lede-bullets"><li>Lesson 01 covered DNS: a domain name → an IP address</li><li>Once a server has a public IP, you’d buy a domain</li><li>A DNS record connects the domain to that IP</li></ul><div className="flow-diagram" aria-label="How a domain name resolves to a server"><div className="flow-step"><b>mycats.com</b><small>the domain you bought</small></div><div className="flow-arrow">→<span>DNS lookup</span></div><div className="flow-step"><b>A / CNAME record</b><small>the domain’s DNS settings</small></div><div className="flow-arrow">→</div><div className="flow-step highlight"><b>Server</b><small>your VPS’s IP, or GitHub Pages</small></div></div><div className="concept-row"><div><b>A record</b><p>Points a domain straight at a fixed IP address—what you’d use for your own VPS running server.py.</p></div><div><b>CNAME record</b><p>Points a domain at another hostname instead of an IP—what GitHub Pages actually uses for a custom domain, since GitHub’s own IPs can change underneath you.</p></div><div><b>Same question, two answers</b><p>Both records answer &quot;where does this name point?&quot;—they just point at different kinds of things, because a VPS you control and a platform like GitHub Pages host your files differently.</p></div></div></article>}

        {current === 14 && <article className="stage final-reflection-stage"><div className="final-reflection-heading"><p className="overline">Return to your starting model</p><h1>What became <em>more precise?</em></h1><ul className="lede lede-bullets"><li>These are the answers you recorded at the start of this lesson</li><li>Read them without editing</li><li>Then explain what you’d add, remove, or say differently now</li></ul></div><div className="answer-review-grid">{catsQuestions.map((question, index) => <article key={question}><span>0{index + 1}</span><div><b>{question}</b><p>{answers[index].trim() || "No starting answer was recorded."}</p></div></article>)}</div><label className="final-reflection"><span>Your revised model</span><b>How do HTML, CSS, JS, the DOM, events, git, GitHub Pages, and DNS all fit together to make this page work?</b><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Explain what you understand now and how your thinking changed…" /></label><div className="finish-card"><span>Lesson 02</span><div><h3>You just read a real project end to end.</h3><p>Every idea here—markup vs. logic, events, the DOM, deployment, DNS—applies to every website you’ll ever look at.</p></div><button onClick={onSyllabus}>Return To Syllabus ↗</button></div></article>}

        <footer className="lesson-nav"><button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← Previous</button><span>{catsPageSteps.map((_, index) => <i key={index} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} />)}</span><button className="next" onClick={next}>{current === catsPageSteps.length - 1 ? "Mark Lesson Complete" : "Next"} →</button></footer>
      </section>
    </main>
  );
}

const lessonTwoSteps = [
  { number: "01", label: "Lesson map", eyebrow: "What execution and debugging mean" },
  { number: "02", label: "Precise instructions", eyebrow: "Algorithms, sequence, and literal machines" },
  { number: "03", label: "Execution & state", eyebrow: "Watch knowledge appear line by line" },
  { number: "04", label: "Debugger controls", eyebrow: "Breakpoints, stepping, watches, and the stack" },
  { number: "05", label: "Debugging method", eyebrow: "Predict, observe, find the first divergence" },
  { number: "06", label: "Explain it back", eyebrow: "Turn observations into a working model" },
] as const;

function LessonTwo({ onSyllabus, onComplete }: { onSyllabus: () => void; onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [teaOrder, setTeaOrder] = useState(teaSteps);
  const [teaMessage, setTeaMessage] = useState("");
  const [traceLine, setTraceLine] = useState(0);
  const [showBug, setShowBug] = useState(false);
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cfp-lesson-2-v1") || "{}");
      if (Array.isArray(saved.completed)) setCompleted(saved.completed);
      if (Number.isInteger(saved.current)) setCurrent(Math.min(saved.current, lessonTwoSteps.length - 1));
      if (typeof saved.reflection === "string") setReflection(saved.reflection);
    } catch { /* Start fresh if saved data is malformed. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("cfp-lesson-2-v1", JSON.stringify({ completed, current, reflection }));
  }, [completed, current, reflection]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") setCurrent((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function next() {
    const nextCompleted = completed.includes(current) ? completed : [...completed, current];
    setCompleted(nextCompleted);
    if (current === lessonTwoSteps.length - 1) {
      localStorage.setItem("cfp-lesson-2-v1", JSON.stringify({ completed: nextCompleted, current, reflection }));
      onComplete();
      return;
    }
    setCurrent((value) => Math.min(lessonTwoSteps.length - 1, value + 1));
  }

  function moveTea(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= teaOrder.length) return;
    const copy = [...teaOrder];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setTeaOrder(copy);
    setTeaMessage("");
  }

  function runTea() {
    const correct = teaOrder.every((step, index) => step === teaSteps[index]);
    setTeaMessage(correct ? "The literal computer made the tea. Sequence matters." : "The computer followed the exact order—and the tea went wrong. Find the earliest impossible step.");
  }

  const variables: Record<string, number> = {};
  if (traceLine >= 1) variables.first_number = 6;
  if (traceLine >= 2) variables.second_number = 7;
  if (traceLine >= 3) variables.answer = 13;
  const progress = Math.round((completed.length / lessonTwoSteps.length) * 100);

  return (
    <main className="course-shell lesson-two-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={onSyllabus} aria-label="Open the course syllabus"><span className="brand-mark"><i /><i /><i /></span><span><strong>Computing</strong><small>from first principles</small></span></button>
        <div className="course-progress" aria-label={`${progress}% of lesson complete`}><span>Lesson progress</span><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
        <button className="lesson-tag syllabus-button" onClick={onSyllabus}>Course syllabus</button>
      </header>
      <aside className="sidebar" aria-label="Lesson 2 stages">
        <div className="sidebar-intro"><span className="signal-dot" /><small>Lesson 03 · 45–60 min</small><h2>How do programs execute—and how do we investigate them?</h2></div>
        <nav>{lessonTwoSteps.map((step, index) => <button key={step.number} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} onClick={() => setCurrent(index)}><span>{completed.includes(index) ? "✓" : step.number}</span><span>{step.label}<small>{step.eyebrow}</small></span></button>)}</nav>
        <div className="key-hint"><kbd>←</kbd><kbd>→</kbd><span>Move between stages</span></div>
      </aside>
      <section className="lesson" id="lesson-2">
        <div className="lesson-heading"><span className="kicker"><i /> {lessonTwoSteps[current].eyebrow}</span><span className="stage-count">Stage {current + 1} / {lessonTwoSteps.length}</span></div>

        {current === 0 && <article className="stage lesson2-map"><div><p className="overline">Lesson 03 · Programs in motion</p><h1>Execution turns instructions into <em>changing state.</em></h1><p className="lede">This lesson makes running programs observable. You’ll predict what should happen, pause execution, inspect what the program knows, and use evidence when reality differs.</p><div className="lesson-promise"><span>Central question</span><p>What happens between reading one line of Python and seeing its effect?</p></div></div><div className="lesson-outcome-panel"><span>By the end, you can</span><ol><li><b>01</b>Describe an algorithm as ordered, precise instructions</li><li><b>02</b>Trace execution and identify changing program state</li><li><b>03</b>Set a breakpoint and step over, into, and out</li><li><b>04</b>Inspect variables, watches, and the call stack</li><li><b>05</b>Find the earliest difference between prediction and reality</li></ol></div></article>}

        {current === 1 && <article className="stage"><p className="overline">An algorithm is a precise procedure</p><h1>Can a very literal machine <em>make tea?</em></h1><p className="lede">A computer cannot fill gaps with common sense. Put the instructions in a workable order, then run them.</p><div className="tea-lab lab-panel"><div className="panel-title"><span>TEA_ALGORITHM.txt</span><small>Order matters</small></div><ol>{teaOrder.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span><div><button onClick={() => moveTea(index, -1)} aria-label={`Move ${step} up`}>↑</button><button onClick={() => moveTea(index, 1)} aria-label={`Move ${step} down`}>↓</button></div></li>)}</ol><button className="run-button" onClick={runTea}><span>▶</span> Run Instructions</button>{teaMessage && <p className="lab-message" role="status">{teaMessage}</p>}</div><div className="concept-row"><div><b>Sequence</b><p>Which instruction happens first?</p></div><div><b>Input & output</b><p>What enters and what should emerge?</p></div><div><b>Decisions</b><p>What changes when a condition is true?</p></div><div><b>Repetition</b><p>Which work happens again?</p></div></div></article>}

        {current === 2 && <article className="stage"><p className="overline">Execution flow and program state</p><h1>Run one line. Then ask: <em>what changed?</em></h1><p className="lede">The highlighted line is the next instruction. Predict its effect before pressing “Step over.”</p><div className="debugger"><div className="editor lab-panel"><div className="panel-title"><span>lesson_02.py</span><small>● paused</small></div><div className="code-lines">{codeLines.map((line) => <div key={line.n} className={traceLine < 5 && line.n === traceLine + 1 ? "active-line" : ""}><span>{line.n}</span><code>{line.text || " "}</code></div>)}</div><button className="run-button" onClick={() => setTraceLine((line) => line >= 5 ? 0 : line + 1)}>{traceLine >= 5 ? "↺ Reset" : "↧ Step Over"}</button></div><div className="inspectors"><div className="inspector"><div className="panel-title"><span>VARIABLES</span><small>Local state</small></div>{Object.keys(variables).length ? Object.entries(variables).map(([key, value]) => <p key={key}><span>{key}</span><b>{value}</b></p>) : <em>No variables yet</em>}</div><div className="inspector"><div className="panel-title"><span>CALL STACK</span></div><p><span>lesson_02.py</span><b>line {Math.min(traceLine + 1, 5)}</b></p></div><div className="inspector console"><div className="panel-title"><span>OUTPUT</span></div><code>{traceLine >= 5 ? "> 13" : "> _"}</code></div></div></div></article>}

        {current === 3 && <article className="stage debugger-controls-stage"><div><p className="overline">A transferable engineering skill</p><h1>The debugger gives you <em>control over time.</em></h1><p className="lede">It pauses a running program and exposes selected parts of its state. It is another abstraction—not a direct view of electrical charge or every byte in memory.</p></div><div className="debugger-controls"><div><kbd>●</kbd><b>Breakpoint</b><p>Pause before a chosen line executes.</p></div><div><kbd>↧</kbd><b>Step over</b><p>Run the current line without entering called functions.</p></div><div><kbd>↓</kbd><b>Step into</b><p>Enter a function call and inspect its execution.</p></div><div><kbd>↑</kbd><b>Step out</b><p>Finish the current function and return to its caller.</p></div><div><kbd>▶</kbd><b>Continue</b><p>Run until the next breakpoint or program end.</p></div><div><kbd>ƒ</kbd><b>Watch</b><p>Re-evaluate a chosen expression whenever execution pauses.</p></div><div><kbd>≡</kbd><b>Call stack</b><p>See which functions called which, and where each paused.</p></div><div><kbd>◇</kbd><b>Conditional breakpoint</b><p>Pause only when a useful condition is true.</p></div></div></article>}

        {current === 4 && <article className="stage bug-stage"><div className="bug-copy"><p className="overline">Evidence-based debugging</p><h1>Find the first place reality <em>diverges.</em></h1><p className="lede">The goal is 17, but this program prints 4. Predict the value of <code>total</code> after each loop iteration before revealing the diagnosis.</p><div className="principle"><span>Method</span><p>Predict → observe → locate the earliest difference → explain the cause → test the correction.</p></div></div><div className="bug-lab lab-panel"><div className="panel-title"><span>broken_total.py</span><small>Expected 17 · Actual 4</small></div><pre><span>prices</span> = [6, 7, 4]{"\n"}<span>total</span> = 0{"\n\n"}<b>for</b> price <b>in</b> prices:{"\n"}    total = price{"\n\n"}print(total)</pre><button className="run-button" onClick={() => setShowBug(!showBug)}>{showBug ? "Hide Diagnosis" : "Reveal Earliest Divergence"}</button>{showBug && <div className="bug-answer"><b>Second iteration</b><p>After the first price, both prediction and reality are 6. After the second, the correct running total is 13—but reality becomes 7 because <code>total = price</code> replaces the total. The correction is <code>total = total + price</code>.</p></div>}</div></article>}

        {current === 5 && <article className="stage lesson2-reflection"><div><p className="overline">Explain it back</p><h1>What does it mean for a program to <em>execute?</em></h1><p className="lede">Explain how sequence, state, breakpoints, stepping, variables, the call stack, prediction, and observation fit together.</p><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Build your explanation in your own words…" /></div><div className="finish-card"><span>Lesson 03</span><div><h3>Debugging is investigation, not failure.</h3><p>Correct output is evidence. A precise explanation of how the program produced it is understanding.</p></div><button onClick={onSyllabus}>Return To Syllabus ↗</button></div></article>}

        <footer className="lesson-nav"><button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← Previous</button><span>{lessonTwoSteps.map((_, index) => <i key={index} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} />)}</span><button className="next" onClick={next}>{current === lessonTwoSteps.length - 1 ? "Mark Lesson Complete" : "Next"} →</button></footer>
      </section>
    </main>
  );
}

export default function Home() {
  const [showSyllabus, setShowSyllabus] = useState(true);
  const [activeLesson, setActiveLesson] = useState<1 | 2 | 3>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(3).fill(""));
  const [byteValue, setByteValue] = useState(65);
  const [bitCount, setBitCount] = useState(1);
  const [pattern, setPattern] = useState(1);
  const [gateA, setGateA] = useState(true);
  const [gateB, setGateB] = useState(false);
  const [gate, setGate] = useState<"AND" | "OR" | "NOT">("AND");
  const [adderA, setAdderA] = useState(true);
  const [adderB, setAdderB] = useState(true);
  const [fullAdderA, setFullAdderA] = useState(true);
  const [fullAdderB, setFullAdderB] = useState(true);
  const [carryIn, setCarryIn] = useState(true);
  const [red, setRed] = useState(76);
  const [green, setGreen] = useState(224);
  const [blue, setBlue] = useState(220);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [protocolDetail, setProtocolDetail] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cfp-course-completed-v2") || "[]");
      if (Array.isArray(saved)) setCompletedLessons(saved.filter((lesson) => Number.isInteger(lesson)));
    } catch { /* No completed lessons yet. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("cfp-course-completed-v2", JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    try {
      const previous = JSON.parse(localStorage.getItem("cfp-lesson-1") || "{}");
      const previousV2 = JSON.parse(localStorage.getItem("cfp-lesson-1-v2") || "{}");
      const previousV3 = JSON.parse(localStorage.getItem("cfp-lesson-1-v3") || "{}");
      const previousV4 = JSON.parse(localStorage.getItem("cfp-lesson-1-v4") || "{}");
      const previousV5 = JSON.parse(localStorage.getItem("cfp-lesson-1-v5") || "{}");
      const previousV6 = JSON.parse(localStorage.getItem("cfp-lesson-1-v6") || "{}");
      const previousV7 = JSON.parse(localStorage.getItem("cfp-lesson-1-v7") || "{}");
      const saved = JSON.parse(localStorage.getItem("cfp-lesson-1-v8") || "{}");
      if (Array.isArray(saved.completed)) setCompleted(saved.completed);
      else if (Array.isArray(previousV7.completed)) setCompleted(previousV7.completed.map((step: number) => step >= 23 ? step + 1 : step));
      if (Array.isArray(saved.answers)) setAnswers(saved.answers);
      else if (Array.isArray(previousV7.answers)) setAnswers(previousV7.answers.slice(0, 3));
      else if (Array.isArray(previousV6.answers)) setAnswers(previousV6.answers.slice(0, 3));
      else if (Array.isArray(previousV5.answers)) setAnswers(previousV5.answers.slice(0, 3));
      else if (Array.isArray(previousV4.answers)) setAnswers(previousV4.answers.slice(0, 3));
      else if (Array.isArray(previousV3.answers)) setAnswers(previousV3.answers.slice(0, 3));
      else if (Array.isArray(previousV2.answers)) setAnswers(previousV2.answers);
      else if (Array.isArray(previous.answers)) setAnswers(previous.answers);
      if (typeof saved.notes === "string") setNotes(saved.notes);
      else if (typeof previousV7.notes === "string") setNotes(previousV7.notes);
      else if (typeof previousV6.notes === "string") setNotes(previousV6.notes);
      else if (typeof previousV5.notes === "string") setNotes(previousV5.notes);
      else if (typeof previousV4.notes === "string") setNotes(previousV4.notes);
      else if (typeof previousV3.notes === "string") setNotes(previousV3.notes);
      else if (typeof previousV2.notes === "string") setNotes(previousV2.notes);
      else if (typeof previous.notes === "string") setNotes(previous.notes);
      if (Number.isInteger(saved.current)) setCurrent(Math.min(saved.current, steps.length - 1));
      else if (Number.isInteger(previousV7.current)) setCurrent(Math.min(previousV7.current >= 23 ? previousV7.current + 1 : previousV7.current, steps.length - 1));
    } catch { /* Begin fresh if local data is malformed. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("cfp-lesson-1-v8", JSON.stringify({ completed, answers, notes, current }));
  }, [completed, answers, notes, current]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (protocolDetail !== null) {
        if (event.key === "Escape") setProtocolDetail(null);
        return;
      }
      if (showSyllabus) {
        if (event.key === "Escape") setShowSyllabus(false);
        return;
      }
      if (activeLesson === 2 || activeLesson === 3) return;
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") setCurrent((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const binary = useMemo(() => pattern.toString(2).padStart(bitCount, "0"), [pattern, bitCount]);
  const byteBinary = byteValue.toString(2).padStart(8, "0");
  const activeBytePlaceValues = byteBinary.split("").flatMap((bit, index) => bit === "1" ? [2 ** (7 - index)] : []);
  const gateResult = gate === "AND" ? gateA && gateB : gate === "OR" ? gateA || gateB : !gateA;
  const adderSum = adderA !== adderB;
  const adderCarry = adderA && adderB;
  const adderResult = Number(adderA) + Number(adderB);
  const firstHalfSum = fullAdderA !== fullAdderB;
  const firstHalfCarry = fullAdderA && fullAdderB;
  const fullAdderSum = firstHalfSum !== carryIn;
  const secondHalfCarry = firstHalfSum && carryIn;
  const carryOut = firstHalfCarry || secondHalfCarry;
  const fullAdderResult = Number(fullAdderA) + Number(fullAdderB) + Number(carryIn);
  const rgbHex = `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  const progress = Math.round((completed.length / steps.length) * 100);
  const layerStep = Math.max(0, Math.min(6, current - 3));
  const activeSystemLayer = systemLayers[systemLayers.length - 1 - layerStep];

  function markLessonComplete(lesson: number) {
    setCompletedLessons((value) => value.includes(lesson) ? value : [...value, lesson]);
  }

  function goNext() {
    setCompleted((value) => value.includes(current) ? value : [...value, current]);
    if (current === steps.length - 1) {
      markLessonComplete(1);
      setShowSyllabus(true);
      return;
    }
    setCurrent((value) => Math.min(steps.length - 1, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (showSyllabus) {
    return <Syllabus completedLessons={completedLessons} onOpenLesson={(lesson) => { setActiveLesson(lesson); setShowSyllabus(false); }} />;
  }

  if (activeLesson === 2) {
    return <CatsPageLesson onSyllabus={() => setShowSyllabus(true)} onComplete={() => { markLessonComplete(2); setShowSyllabus(true); }} />;
  }

  if (activeLesson === 3) {
    return <LessonTwo onSyllabus={() => setShowSyllabus(true)} onComplete={() => { markLessonComplete(3); setShowSyllabus(true); }} />;
  }

  return (
    <main className="course-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setShowSyllabus(true)} aria-label="Open the course syllabus">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>Computing</strong><small>from first principles</small></span>
        </button>
        <div className="course-progress" aria-label={`${progress}% of lesson complete`}>
          <span>Lesson progress</span>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
        </div>
        <button className="lesson-tag syllabus-button" onClick={() => setShowSyllabus(true)}>Course syllabus</button>
      </header>

      <aside className="sidebar" aria-label="Lesson stages">
        <div className="sidebar-intro">
          <span className="signal-dot" />
          <small>Lesson 01 · 130–165 min</small>
          <h2>How can 0 and 1 make all of this?</h2>
        </div>
        <nav>
          {steps.map((step, index) => (
            <button key={step.id} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} onClick={() => setCurrent(index)}>
              <span>{completed.includes(index) ? "✓" : step.number}</span>
              <span>{step.label}<small>{step.eyebrow}</small></span>
            </button>
          ))}
        </nav>
        <div className="key-hint"><kbd>←</kbd><kbd>→</kbd><span>Move between stages</span></div>
      </aside>

      <section className="lesson" id="lesson">
        <div className="lesson-heading">
          <span className="kicker"><i /> {steps[current].eyebrow}</span>
          <span className="stage-count">Stage {current + 1} / {steps.length}</span>
        </div>

        {current === 0 && (
          <article className="stage lesson-map-stage">
            <div className="lesson-map-copy">
              <p className="overline">Lesson 01 · Your map of the machine</p>
              <h1>How can 0 and 1 make <em>all of this?</em></h1>
              <p className="lede">We’ll climb through seven layers of abstraction, open the machine to see how its parts exchange data, then connect it to operating systems, the internet, and the Python programs you write.</p>
              <div className="lesson-promise"><span>Central idea</span><p>Complexity is built by combining simple operations, then hiding completed complexity behind useful abstractions.</p></div>
            </div>
            <div className="lesson-outcome-panel">
              <span>By the end, you can explain</span>
              <ol><li><b>01</b>Why digital circuits use two reliable states</li><li><b>02</b>How bit patterns represent many kinds of information</li><li><b>03</b>What each computer layer provides and hides</li><li><b>04</b>How a computer’s internal parts compute, store, and move data</li><li><b>05</b>How operating systems coordinate hardware and applications</li><li><b>06</b>How internet infrastructure connects a browser to services such as Gmail</li></ol>
              <small>27 screens · approximately 130–165 minutes</small>
            </div>
          </article>
        )}

        {current === 1 && (
          <article className="stage hero-stage">
            <p className="overline">Before we add anything</p>
            <h1>Capture your starting model <em>now.</em></h1>
            <p className="lede">Use plain language and make your best guess. Your answers are saved exactly as written so you can compare them with what you know at the end.</p>
            <div className="question-grid">
              {questions.map((question, index) => (
                <label className="question-card" key={question}>
                  <span><b>0{index + 1}</b>{question}</span>
                  <textarea value={answers[index]} onChange={(event) => setAnswers((all) => all.map((answer, i) => i === index ? event.target.value : answer))} placeholder={index === 2 ? "For example: what could one number for red, one for green, and one for blue control?" : "Write your best current explanation…"} />
                </label>
              ))}
            </div>
            <div className="principle"><span>Working rule</span><p>A specific guess is useful—even when it is wrong—because you can see exactly how your model changes.</p></div>
          </article>
        )}

        {current === 2 && (
          <article className="stage overview-stage">
            <div className="overview-copy"><p className="overline">The complete abstraction ladder</p><h1>One machine. <em>Seven useful views.</em></h1><p className="lede">This is the whole map. Next, we’ll start with hardware at the bottom and climb one layer at a time toward human intention.</p><div className="os-umbrella-note"><b>Operating system</b><span>An umbrella spanning the kernel, its protected interface, and userspace facilities—not a separate rung.</span></div></div>
            <div className="overview-stack" aria-label="Seven abstraction layers">
              <span className="human-end">Closer to human intention ↑</span>
              {systemLayers.map((layer, index) => <div className={`overview-layer overview-${layer.zone}`} key={layer.name}><b>{String(systemLayers.length - index).padStart(2, "0")}</b><span><strong>{layer.name}</strong><small>{layer.short}</small></span>{layer.zone === "os" && <i>OS</i>}</div>)}
              <span className="physical-end">Closer to physical behavior ↓</span>
            </div>
          </article>
        )}

        {current >= 3 && current <= 9 && (
          <article className="stage layer-stage">
            <div className="layer-mini-map" aria-label={`Layer ${layerStep + 1} of 7`}>
              <span>Human intention</span>
              {systemLayers.map((layer, index) => <div key={layer.name} className={`${index === systemLayers.length - 1 - layerStep ? "active" : ""} mini-${layer.zone}`}><b>{systemLayers.length - index}</b><small>{layer.name}</small></div>)}
              <span>Physical behavior</span>
            </div>
            <div className="layer-screen-copy">
              <div className="layer-screen-heading"><span>Layer {layerStep + 1} of 7</span><small>{activeSystemLayer.zone === "os" ? "Inside the operating-system umbrella" : activeSystemLayer.zone}</small></div>
              <h1>{activeSystemLayer.name}</h1>
              <p className="layer-short">{activeSystemLayer.short}</p>
              <dl className="layer-screen-facts"><div><dt>What it provides</dt><dd>{activeSystemLayer.provides}</dd></div><div><dt>What the next layer can ignore</dt><dd>{activeSystemLayer.hides}</dd></div></dl>
              <div className="layer-print-example"><span>Its part in <code>print(&quot;Hello&quot;)</code></span><p>{activeSystemLayer.example}</p></div>
              {layerStep === 2 && <div className="layer-nuance"><b>Where is the operating system?</b><p>You have entered it here. The next three views—kernel and drivers, kernel interface, and userspace APIs—are useful parts of the larger operating-system environment.</p></div>}
              {layerStep === 6 && <div className="layer-nuance"><b>The view from the top</b><p>Your application expresses the goal. It succeeds because every completed layer below provides a simpler service to the one above.</p></div>}
            </div>
          </article>
        )}

        {current === 10 && (
          <article className="stage internals-stage">
            <div className="internals-heading">
              <p className="overline">Inside the hardware layer · The complete map</p>
              <h1>A computer is parts <em>exchanging data.</em></h1>
              <p className="lede">The CPU performs instructions, memory holds active work, storage keeps data, and I/O connects the machine to devices and networks. The motherboard provides the paths between them.</p>
            </div>
            <div className="computer-board" aria-label="Simplified internal architecture of a computer">
              <span className="board-label">Motherboard · power, timing, and interconnects</span>
              <div className="board-core">
                <div className="hardware-block cpu-block"><small>COMPUTE</small><b>CPU</b><span>cores · registers · cache</span></div>
                <i>⇄</i>
                <div className="hardware-block ram-block"><small>ACTIVE WORK</small><b>RAM</b><span>code and data in use</span></div>
              </div>
              <div className="board-fabric"><span>memory channels + I/O interconnects</span></div>
              <div className="board-devices">
                <div className="hardware-block"><small>PERSIST</small><b>SSD / disk</b><span>files and programs</span></div>
                <div className="hardware-block pcie-block"><small>PCIe</small><b>GPU</b><span>graphics and parallel work</span></div>
                <div className="hardware-block"><small>NETWORK</small><b>Wi‑Fi / Ethernet</b><span>packets in and out</span></div>
                <div className="hardware-block usb-block"><small>USB</small><b>External devices</b><span>input, storage, cameras</span></div>
              </div>
            </div>
            <div className="data-movement-note"><b>The unifying idea</b><span>Computation changes data. Memory holds it. I/O moves it. Buses give it a route.</span></div>
          </article>
        )}

        {current === 11 && (
          <article className="stage cpu-memory-stage">
            <div className="cpu-memory-copy">
              <p className="overline">Inside the computer · Compute and remember</p>
              <h1>The CPU works from a <em>memory hierarchy.</em></h1>
              <p className="lede">A CPU repeatedly fetches instructions and data, performs operations, and stores results. Fast storage is scarce and close; larger storage is slower and farther away.</p>
              <div className="cpu-parts"><div><b>Control</b><span>Chooses and coordinates the next instruction.</span></div><div><b>Execution units</b><span>Perform arithmetic, logic, and other operations.</span></div><div><b>Cores</b><span>Allow more than one instruction stream to make progress.</span></div></div>
            </div>
            <div className="memory-hierarchy" aria-label="Memory and storage hierarchy from fastest and smallest to slowest and largest">
              <div className="hierarchy-axis"><span>faster · smaller · closest</span><i>↓</i><span>slower · larger · persistent</span></div>
              <div className="memory-level register"><b>Registers</b><span>Values the CPU is using right now</span><small>tiny · fastest</small></div>
              <div className="memory-level cache"><b>CPU cache</b><span>L1, L2, and L3 keep likely-needed data nearby</span><small>very fast</small></div>
              <div className="memory-level ram"><b>RAM</b><span>Running programs and their active data</span><small>volatile</small></div>
              <div className="memory-level storage"><b>SSD / HDD</b><span>Programs and files that survive power-off</span><small>persistent</small></div>
              <p><strong>Volatile</strong> means RAM loses its contents when power is removed. Storage is built to retain them.</p>
            </div>
          </article>
        )}

        {current === 12 && (
          <article className="stage io-stage">
            <div className="io-heading"><p className="overline">Inside the computer · Input and output</p><h1>I/O is how computing <em>touches the world.</em></h1><p className="lede"><strong>I/O means input/output:</strong> transferring data between a processor and memory, storage, a network, or another device. Without I/O, a computer could calculate—but it could not receive useful input, preserve a result, display it, or communicate it.</p></div>
            <div className="io-cards">
              <article><span>DISK I/O</span><h2>Read and write persistent data</h2><p>Loading a program, opening a photo, saving a document, and querying a database all require data to cross between storage and memory.</p><div><b>SSD / disk</b><i>⇄</i><b>RAM</b></div></article>
              <article><span>NETWORK I/O</span><h2>Send and receive packets</h2><p>Web requests, video calls, multiplayer games, and email turn in-memory data into signals that travel through network interfaces.</p><div><b>RAM</b><i>⇄</i><b>Network</b></div></article>
              <article><span>HUMAN I/O</span><h2>Accept actions and present results</h2><p>Keyboards, touchscreens, microphones, displays, speakers, and printers connect human activity to computation.</p><div><b>Person</b><i>⇄</i><b>Device</b></div></article>
            </div>
            <div className="io-cycle"><b>Most useful programs repeat:</b><span>receive input</span><i>→</i><span>compute</span><i>→</i><span>store or output</span><i>↻</i></div>
          </article>
        )}

        {current === 13 && (
          <article className="stage buses-stage">
            <div className="buses-heading"><p className="overline">Inside the computer · Paths and coordination</p><h1>Buses connect the parts. <em>Coordination keeps them moving.</em></h1><p className="lede">A bus is a shared communication system: physical links plus rules for carrying data and control messages between components.</p></div>
            <div className="bus-compare">
              <article className="bus-card pcie"><span>INTERNAL · HIGH SPEED</span><h2>PCI Express (PCIe)</h2><p>Modern point-to-point links connect high-bandwidth devices. “PCI bus” is often said casually, but current computers primarily use serial <strong>PCIe</strong>, not the older parallel PCI bus.</p><div><b>GPU</b><b>NVMe SSD</b><b>Network card</b><b>Capture / sound</b></div></article>
              <article className="bus-card usb"><span>EXTERNAL · GENERAL PURPOSE</span><h2>USB bus</h2><p>A USB controller and hubs connect hot-pluggable devices through a hierarchy. One interface can carry data and often electrical power.</p><div><b>Keyboard</b><b>Mouse</b><b>Camera</b><b>Storage</b><b>Microcontroller</b></div></article>
            </div>
            <div className="coordination-grid">
              <div><b>Interrupts</b><p>A device signals that it needs CPU attention: “a packet arrived” or “this transfer finished.”</p></div>
              <div><b>DMA</b><p>Direct memory access lets a device move blocks of data to or from RAM without the CPU copying every byte.</p></div>
              <div><b>Power & cooling</b><p>They do not compute, but stable power and heat removal are physical requirements for every component to operate reliably.</p></div>
            </div>
          </article>
        )}

        {current === 14 && (
          <article className="stage os-stage">
            <div className="os-definition">
              <p className="overline">The operating-system umbrella</p>
              <h1>What is an <em>operating system?</em></h1>
              <p className="lede">An operating system coordinates the computer’s hardware, protects programs from one another, and provides shared services that applications can use.</p>
              <div className="os-responsibilities"><span>It manages</span><div><b>Processes</b><b>Memory</b><b>Files</b><b>Devices</b><b>Security</b><b>Networks</b></div></div>
              <div className="os-anatomy"><div><b>Kernel & drivers</b><span>Control resources and hardware</span></div><i>+</i><div><b>Kernel interface</b><span>Accept protected requests</span></div><i>+</i><div><b>Userspace facilities</b><span>Offer convenient APIs and services</span></div></div>
            </div>
            <div className="os-examples" aria-label="Examples of operating systems and where they are used">
              <article className="os-example windows"><span>W</span><div><h2>Windows</h2><p>Common on laptops and desktop PCs. <strong>Windows Server</strong> is widely used for Microsoft-centered business services and enterprise networks.</p></div></article>
              <article className="os-example linux"><span>Li</span><div><h2>Linux</h2><p>Used on laptops and desktops, and especially on servers, cloud systems, and network infrastructure—the backbone of much of the internet.</p></div></article>
              <article className="os-example macos"><span>Mac</span><div><h2>macOS</h2><p>Apple’s operating system for Mac laptops and desktop computers. It runs only on Apple’s Mac product line.</p></div></article>
              <article className="os-example android"><span>A</span><div><h2>Android</h2><p>A mobile operating system used on phones and tablets made by many manufacturers, including Google, Samsung, and Motorola.</p></div></article>
              <article className="os-example ios"><span>i</span><div><h2>iOS</h2><p>Apple’s mobile operating system for the iPhone. Unlike Android, it is exclusive to devices made by Apple.</p></div></article>
            </div>
          </article>
        )}

        {current === 15 && (
          <article className="stage internet-stage">
            <div className="internet-heading"><p className="overline">How the internet works · The complete route</p><h1>Your browser visits <em>gmail.com.</em></h1><p className="lede">The internet is not one machine or one company. It is a network of networks that agree how to address, route, and exchange packets of data.</p></div>
            <div className="internet-route" aria-label="Traffic flow from a browser to Gmail">
              <div className="route-node home"><b>01</b><span><strong>Browser</strong><small>Creates a secure web request</small></span></div><i>→</i>
              <div className="home-router-group" aria-label="What many people call a router">
                <span>What many people call “a router”</span>
                <div className="home-router-nodes">
                  <div className="route-node home"><b>02</b><span><strong>Wi‑Fi access point</strong><small>Moves radio signals onto the local network</small></span></div><i>→</i>
                  <div className="route-node home"><b>03</b><span><strong>Router</strong><small>Sends packets beyond your home network</small></span></div><i>→</i>
                  <div className="route-node home"><b>04</b><span><strong>Modem or fiber ONT</strong><small>Connects your equipment to the ISP’s line</small></span></div>
                </div>
              </div><i>→</i>
              <div className="route-node network"><b>05</b><span><strong>Internet provider</strong><small>Routes traffic into other networks</small></span></div><i>→</i>
              <div className="route-node network"><b>06</b><span><strong>Internet backbone</strong><small>High-capacity links between many networks</small></span></div><i>→</i>
              <div className="route-node google"><b>07</b><span><strong>Google edge</strong><small>Accepts traffic near the network boundary</small></span></div><i>→</i>
              <div className="route-node google"><b>08</b><span><strong>Gmail services</strong><small>Authenticate and process the request</small></span></div><i>→</i>
              <div className="route-node data"><b>09</b><span><strong>Distributed storage</strong><small>Loads mailbox and message data</small></span></div>
            </div>
            <div className="route-return"><span>REQUEST →</span><p>The reply travels back through networks to the browser.</p><span>← RESPONSE</span></div>
            <div className="home-device-note"><b>One physical box, several jobs.</b><span>The highlighted group shows the access point, routing, and modem/ONT responsibilities people often collectively call “the router.” Some homes use separate devices instead.</span></div>
          </article>
        )}

        {current === 16 && (
          <article className="stage request-stage">
            <div className="request-heading"><p className="overline">How the internet works · Request and response</p><h1>A web page is a <em>conversation.</em></h1><p className="lede">Before Gmail can appear, several protocols cooperate. Each solves a smaller problem and hides it from the layer above.</p></div>
            <div className="request-phases">
              {requestPhases.map((phase, index) => <button className="request-phase-card" key={phase.title} onClick={() => setProtocolDetail(index)} aria-haspopup="dialog"><b>{String(index + 1).padStart(2, "0")}</b><span className="request-phase-copy"><span>{phase.label}</span><strong>{phase.title}</strong><small>{phase.summary}</small></span><i>Explain this step ↗</i></button>)}
            </div>
            <div className="packet-note"><code>gmail.com</code><i>≠</i><span>one server</span><p>A large service uses many data centers, edge systems, application servers, caches, and storage systems working together.</p></div>
            {protocolDetail !== null && (() => {
              const phase = requestPhases[protocolDetail];
              return <div className="protocol-modal-backdrop" onClick={() => setProtocolDetail(null)}><section className="protocol-modal" role="dialog" aria-modal="true" aria-labelledby="protocol-modal-title" onClick={(event) => event.stopPropagation()}><header><span>{phase.kind}</span><button onClick={() => setProtocolDetail(null)} aria-label="Close protocol explanation">×</button></header><div className="protocol-modal-title"><b>{String(protocolDetail + 1).padStart(2, "0")}</b><div><small>{phase.title} · {phase.label}</small><h2 id="protocol-modal-title">{phase.fullName}</h2></div></div><div className="protocol-detail-grid"><article><span>What it does</span><p>{phase.purpose}</p></article><article><span>What happens</span><p>{phase.journey}</p></article><article><span>In the Gmail example</span><p>{phase.gmail}</p></article><article className="protocol-example"><span>Example: how it works</span><p>{phase.example}</p></article></div><footer><span>{protocolDetail + 1} of {requestPhases.length}</span><div><button onClick={() => setProtocolDetail((value) => value === null ? null : Math.max(0, value - 1))} disabled={protocolDetail === 0}>← Previous</button><button onClick={() => setProtocolDetail((value) => value === null ? null : Math.min(requestPhases.length - 1, value + 1))} disabled={protocolDetail === requestPhases.length - 1}>Next →</button></div></footer></section></div>;
            })()}
          </article>
        )}

        {current === 17 && (
          <article className="stage email-stage">
            <div className="email-heading"><p className="overline">How the internet works · Email infrastructure</p><h1>Opening Gmail and <em>sending mail</em> are different journeys.</h1><p className="lede">Your browser talks to Gmail over HTTPS. Mail providers exchange messages with one another using mail-delivery infrastructure, principally SMTP.</p></div>
            <div className="mail-flow">
              <div className="mail-lane"><span className="lane-label">Your browser · HTTPS</span><div><b>Compose</b><i>→</i><b>Gmail web service</b><i>→</i><b>Account & mailbox storage</b></div></div>
              <div className="mail-lane outbound"><span className="lane-label">Sending to another provider</span><div><b>Gmail outbound server</b><i>→</i><b>DNS finds recipient mail server</b><i>→</i><b>SMTP delivery</b><i>→</i><b>Recipient provider</b></div></div>
              <div className="mail-lane inbound"><span className="lane-label">Receiving at Gmail</span><div><b>Other provider</b><i>→</i><b>Gmail inbound server</b><i>→</i><b>Spam & malware checks</b><i>→</i><b>Gmail mailbox storage</b></div></div>
            </div>
            <div className="mail-explain-grid"><div><b>SMTP moves mail between providers</b><p>A sending server looks up the destination domain’s mail records and hands the message to a receiving server. Delivery may be retried if that server is temporarily unavailable.</p></div><div><b>Storage makes mail persistent</b><p>Gmail stores messages and mailbox state in distributed systems. Your browser requests a view of that stored state; it is not the permanent home of the email.</p></div><div><b>Receiving includes policy and safety</b><p>Incoming messages pass through identity, spam, malware, and policy checks before appearing in the recipient’s mailbox.</p></div></div>
            <div className="same-provider-note">If sender and recipient both use Gmail, Google may deliver the message entirely within its own infrastructure—but the sender, mailbox, safety, and storage responsibilities still exist.</div>
          </article>
        )}

        {current === 18 && (
          <article className="stage signals-stage">
            <p className="overline">Signals to bits · The physical foundation</p>
            <h1>Computers don’t contain tiny <em>ones and zeros.</em></h1>
            <p className="lede">Electronic circuits contain voltages and currents that vary continuously. A digital circuit uses thresholds to classify broad, reliable ranges as two states. We name those interpretations <strong>0</strong> and <strong>1</strong>.</p>
            <div className="signal-visual">
              <div className="scope-grid"><span className="scope-line" /><i className="pulse p1" /><i className="pulse p2" /><i className="pulse p3" /></div>
              <div className="threshold"><span>HIGH RANGE → label 1</span><i /><span>LOW RANGE → label 0</span></div>
            </div>
            <div className="signal-explain-row"><div><b>1 · Physical signal</b><span>A wire carries a measurable voltage.</span></div><i>→</i><div><b>2 · Threshold</b><span>The circuit classifies a safe low or high range.</span></div><i>→</i><div><b>3 · Symbol</b><span>Humans label the result 0 or 1.</span></div></div>
            <div className="signal-noise-note"><b>Why ranges instead of exact values?</b><span>Small electrical disturbances can change a voltage slightly. Wide low and high ranges let a circuit recover the intended state reliably.</span></div>
          </article>
        )}

        {current === 20 && (
          <article className="stage byte-stage">
            <div className="byte-copy"><p className="overline">Bits and bytes · Useful groups</p><h1>One bit is a choice. Eight bits make a <em>byte.</em></h1><p className="lede">A bit has two possible states. Put bits side by side and the number of distinct patterns grows quickly. A byte is the standard group of eight bits used as a basic unit of storage.</p><div className="byte-vocabulary"><div><b>bit</b><span>one binary state: 0 or 1</span></div><div><b>byte</b><span>eight bits together</span></div><div><b>0–255</b><span>256 possible unsigned values</span></div></div></div>
            <div className="byte-panel lab-panel">
              <div className="panel-title"><span>ONE BYTE · CLICK TO TOGGLE</span><small>{byteBinary}₂ = {byteValue}₁₀</small></div>
              <div className="byte-bits">{byteBinary.split("").map((bit, index) => { const placeValue = 2 ** (7 - index); return <button type="button" key={placeValue} aria-pressed={bit === "1"} aria-label={`Toggle ${placeValue}s bit, currently ${bit === "1" ? "on" : "off"}`} onClick={() => setByteValue((value) => value ^ placeValue)}><small>{placeValue}</small><BitLamp on={bit === "1"} /><b>{bit}</b></button>; })}</div>
              <div className="byte-sum"><span>On place values: {activeBytePlaceValues.length ? activeBytePlaceValues.join(" + ") : "none"}</span><b>byte value = {byteValue}</b></div>
              <div className="byte-growth"><div><b>1 bit</b><span>2 patterns</span></div><i>→</i><div><b>2 bits</b><span>4 patterns</span></div><i>→</i><div><b>4 bits</b><span>16 patterns</span></div><i>→</i><div><b>8 bits</b><span>256 patterns</span></div></div>
              <p><strong>Click any bit</strong> to switch it between 0 and 1. The byte value is the sum of the place values that are on; 256 patterns represent the unsigned numbers <strong>0 through 255</strong>.</p>
            </div>
          </article>
        )}

        {current === 19 && (
          <article className="stage pattern-stage">
            <div className="pattern-copy"><p className="overline">Binary patterns · Possibilities</p><h1>Every added bit <em>doubles</em> the patterns.</h1><p className="lede">Each position has two choices. With <strong>n</strong> bit positions, there are <strong>2ⁿ</strong> possible patterns. Move the controls and watch the rule hold.</p><div className="pattern-rule"><span>number of patterns</span><b>2<sup>number of bits</sup></b></div></div>
            <div className="lab-panel bit-lab pattern-lab">
              <div className="panel-title"><span>BIT PATTERN LAB</span><small>{bitCount} bits → {2 ** bitCount} patterns</small></div>
              <div className="bit-display">{binary.split("").map((bit, index) => <div key={index}><BitLamp on={bit === "1"} /><b>{bit}</b></div>)}</div>
              <label>Number of bits <input type="range" min="1" max="8" value={bitCount} onChange={(e) => { const next = Number(e.target.value); setBitCount(next); setPattern((value) => Math.min(value, 2 ** next - 1)); }} /><strong>{bitCount}</strong></label>
              <label>Pattern value <input type="range" min="0" max={2 ** bitCount - 1} value={pattern} onChange={(e) => setPattern(Number(e.target.value))} /><strong>{pattern}</strong></label>
              <p><strong>{binary}</strong> is one of <strong>{2 ** bitCount}</strong> possible patterns.</p>
              <div className="prediction-box"><b>Predict</b><span>How many patterns can 8 bits represent?</span>{prediction === null ? <div><button onClick={() => setPrediction("128")}>128</button><button onClick={() => setPrediction("256")}>256</button><button onClick={() => setPrediction("512")}>512</button></div> : <p className={prediction === "256" ? "correct" : "incorrect"}>{prediction === "256" ? "Exactly: 2⁸ = 256." : "Test the rule: 2⁸ = 256."} <button onClick={() => setPrediction(null)}>Try Again</button></p>}</div>
            </div>
          </article>
        )}

        {current === 21 && (
          <article className="stage logic-stage">
            <div className="logic-copy"><p className="overline">Logic gates · Rules for bits</p><h1>Gates turn input bits into an <em>output bit.</em></h1><p className="lede">A logic gate implements a tiny rule. Real processors combine enormous numbers of gates into circuits that add numbers, compare values, select instructions, and remember state.</p><div className="logic-definitions"><div><b>AND</b><span>1 only when both inputs are 1</span></div><div><b>OR</b><span>1 when either input is 1</span></div><div><b>NOT</b><span>reverses one input</span></div></div></div>
            <div className="lab-panel gate-lab logic-lab">
              <div className="panel-title"><span>LOGIC GATE LAB</span><div><button className={gate === "AND" ? "selected" : ""} onClick={() => setGate("AND")}>AND</button><button className={gate === "OR" ? "selected" : ""} onClick={() => setGate("OR")}>OR</button><button className={gate === "NOT" ? "selected" : ""} onClick={() => setGate("NOT")}>NOT</button></div></div>
              <div className={`gate-machine gate-${gate.toLowerCase()}`}>
                <div className="gate-inputs">
                  <button onClick={() => setGateA(!gateA)} aria-pressed={gateA}><BitLamp on={gateA} /> A = {Number(gateA)}</button>
                  {gate !== "NOT" && <button onClick={() => setGateB(!gateB)} aria-pressed={gateB}><BitLamp on={gateB} /> B = {Number(gateB)}</button>}
                </div>
                <div className="gate-input-wires" aria-hidden="true">
                  <i className={gateA ? "is-on" : ""} />
                  {gate !== "NOT" && <i className={gateB ? "is-on" : ""} />}
                </div>
                <span className="gate-shape">{gate}</span><i className={`wire ${gateResult ? "is-on" : ""}`} aria-hidden="true" /><div className={`output ${gateResult ? "on" : ""}`}><BitLamp on={gateResult} /> OUT = {Number(gateResult)}</div>
              </div>
              <p>{gate === "AND" ? `${Number(gateA)} AND ${Number(gateB)} is ${Number(gateResult)} because both inputs must be 1.` : gate === "OR" ? `${Number(gateA)} OR ${Number(gateB)} is ${Number(gateResult)} because at least one input must be 1.` : `NOT ${Number(gateA)} is ${Number(gateResult)} because NOT reverses its input.`}</p>
              <div className="gate-scale"><b>gates</b><i>→</i><span>adders & memory</span><i>→</i><span>CPU</span><i>→</i><span>running program</span></div>
            </div>
          </article>
        )}

        {current === 22 && (
          <article className="stage half-adder-stage">
            <div className="half-adder-copy">
              <p className="overline">From gates to arithmetic · A real circuit</p>
              <h1>Build the smallest calculator: <em>a half adder.</em></h1>
              <p className="lede">A half adder combines two one-bit inputs. An <strong>XOR</strong> gate produces the answer’s ones place, while an <strong>AND</strong> gate carries a value into the next place.</p>
              <div className="half-adder-idea">
                <div><b>SUM = A XOR B</b><span>The sum is 1 when the inputs are different.</span></div>
                <div><b>CARRY = A AND B</b><span>The carry is 1 only when both inputs are 1.</span></div>
              </div>
              <div className="half-adder-formula"><span>XOR from the gates you know</span><code>A XOR B = (A OR B) AND NOT (A AND B)</code></div>
            </div>

            <div className="half-adder-lab lab-panel">
              <div className="panel-title"><span>HALF ADDER</span><small>two inputs · two outputs</small></div>
              <div className="half-adder-circuit">
                <div className="adder-inputs" aria-label="Half adder inputs">
                  <button type="button" className={adderA ? "is-on" : ""} aria-pressed={adderA} onClick={() => setAdderA((value) => !value)}><BitLamp on={adderA} /><span>INPUT A</span><b>{Number(adderA)}</b></button>
                  <button type="button" className={adderB ? "is-on" : ""} aria-pressed={adderB} onClick={() => setAdderB((value) => !value)}><BitLamp on={adderB} /><span>INPUT B</span><b>{Number(adderB)}</b></button>
                </div>
                <div className="adder-fanout" aria-hidden="true"><i /><i /><i /></div>
                <div className="adder-gates"><div><b>XOR</b><span>different?</span></div><div><b>AND</b><span>both 1?</span></div></div>
                <div className="adder-wires" aria-hidden="true"><i /><i /></div>
                <div className="adder-outputs" aria-label="Half adder outputs">
                  <div className={adderSum ? "is-on" : ""}><BitLamp on={adderSum} /><span>SUM</span><b>{Number(adderSum)}</b></div>
                  <div className={adderCarry ? "is-on" : ""}><BitLamp on={adderCarry} /><span>CARRY</span><b>{Number(adderCarry)}</b></div>
                </div>
              </div>
              <div className="adder-result" aria-live="polite"><span>{Number(adderA)} + {Number(adderB)}</span><b>{Number(adderCarry)}{Number(adderSum)}<sub>2</sub> = {adderResult}<sub>10</sub></b></div>
              <section className="half-adder-truth-block" aria-labelledby="half-adder-truth-title">
                <div className="truth-table-intro"><div><b id="half-adder-truth-title">Truth table</b><span>Every possible input combination and its result</span></div><small><i /> Highlighted row matches the circuit above</small></div>
                <table className="half-adder-truth">
                  <thead><tr className="truth-groups"><th scope="colgroup" colSpan={2}>Inputs</th><th scope="colgroup" colSpan={2}>Outputs</th></tr><tr><th scope="col">A</th><th scope="col">B</th><th scope="col">Sum</th><th scope="col">Carry</th></tr></thead>
                  <tbody>{[[0, 0, 0, 0], [0, 1, 1, 0], [1, 0, 1, 0], [1, 1, 0, 1]].map((row) => { const active = row[0] === Number(adderA) && row[1] === Number(adderB); return <tr key={`${row[0]}-${row[1]}`} className={active ? "active" : ""} aria-current={active ? "true" : undefined}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>; })}</tbody>
                </table>
              </section>
              <div className="adder-bridge"><b>From one bit to a CPU</b><span>A <strong>full adder</strong> also accepts a carry from the previous place. Chain full adders together and a processor can add multi-bit numbers.</span></div>
            </div>
          </article>
        )}

        {current === 23 && (
          <article className="stage full-adder-stage">
            <div className="full-adder-copy">
              <p className="overline">From one-bit addition to real arithmetic</p>
              <h1>A full adder makes <em>carry</em> part of the calculation.</h1>
              <p className="lede">A half adder cannot accept a carry from a lower place. A full adder adds <strong>A</strong>, <strong>B</strong>, and <strong>CARRY IN</strong>—then produces a <strong>SUM</strong> here and a <strong>CARRY OUT</strong> for the next place.</p>
              <div className="full-adder-rules">
                <div><span>SUM</span><code>A XOR B XOR CARRY IN</code></div>
                <div><span>CARRY OUT</span><code>(A AND B) OR (CARRY IN AND (A XOR B))</code></div>
              </div>
              <table className="full-adder-truth">
                <caption>Full adder truth table</caption>
                <thead><tr><th>A</th><th>B</th><th>C<sub>IN</sub></th><th>SUM</th><th>C<sub>OUT</sub></th></tr></thead>
                <tbody>{fullAdderRows.map((row) => <tr key={`${row[0]}-${row[1]}-${row[2]}`} className={row[0] === Number(fullAdderA) && row[1] === Number(fullAdderB) && row[2] === Number(carryIn) ? "active" : ""}>{row.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody>
              </table>
            </div>

            <div className="full-adder-lab lab-panel">
              <div className="panel-title"><span>FULL ADDER</span><small>three inputs · two outputs</small></div>
              <div className="full-adder-inputs" aria-label="Full adder inputs">
                {[["A", fullAdderA, setFullAdderA], ["B", fullAdderB, setFullAdderB], ["CARRY IN", carryIn, setCarryIn]].map(([label, value, setter]) => <button type="button" key={label as string} className={value ? "is-on" : ""} aria-pressed={value as boolean} onClick={() => (setter as (value: boolean) => void)(!(value as boolean))}><BitLamp on={value as boolean} /><span>{label as string}</span><b>{Number(value)}</b></button>)}
              </div>
              <div className="full-adder-network" aria-label="Two half adders and an OR gate form one full adder">
                <div className="full-adder-unit">
                  <header><span>HALF ADDER 1</span><small>A + B</small></header>
                  <div><span>partial sum</span><b>P = {Number(firstHalfSum)}</b><BitLamp on={firstHalfSum} /></div>
                  <div><span>first carry</span><b>C1 = {Number(firstHalfCarry)}</b><BitLamp on={firstHalfCarry} /></div>
                </div>
                <i className="full-adder-wire" aria-hidden="true">→</i>
                <div className="full-adder-unit second">
                  <header><span>HALF ADDER 2</span><small>P + C<sub>IN</sub></small></header>
                  <div><span>final sum</span><b>SUM = {Number(fullAdderSum)}</b><BitLamp on={fullAdderSum} /></div>
                  <div><span>second carry</span><b>C2 = {Number(secondHalfCarry)}</b><BitLamp on={secondHalfCarry} /></div>
                </div>
                <i className="full-adder-wire" aria-hidden="true">→</i>
                <div className="full-adder-unit carry-unit">
                  <header><span>OR GATE</span><small>C1 OR C2</small></header>
                  <div><span>carry out</span><b>C<sub>OUT</sub> = {Number(carryOut)}</b><BitLamp on={carryOut} /></div>
                </div>
              </div>
              <div className="full-adder-result" aria-live="polite"><span>{Number(fullAdderA)} + {Number(fullAdderB)} + carry {Number(carryIn)}</span><b>{Number(carryOut)}{Number(fullAdderSum)}<sub>2</sub> = {fullAdderResult}<sub>10</sub></b></div>
              <div className="carry-chain"><span>carry from previous place</span><i>→</i><b>C<sub>IN</sub></b><i>→</i><strong>FULL ADDER</strong><i>→</i><b>C<sub>OUT</sub></b><i>→</i><span>carry to next place</span></div>
              <div className="full-adder-scale"><b>Chain one per bit</b><span><code>0111 + 0001</code> becomes <code>1000</code> as each carry flows left into the next full adder.</span></div>
            </div>
          </article>
        )}

        {current === 24 && (
          <article className="stage rgb-stage">
            <div className="rgb-copy"><p className="overline">RGB pixels · A concrete representation</p><h1>Three bytes can describe <em>one pixel’s colour.</em></h1><p className="lede">In a simple RGB image, each pixel has a red, green, and blue channel. One byte per channel gives each intensity a value from 0 to 255. The display mixes those light levels into the colour you see.</p><div className="rgb-facts"><div><b>R</b><span>red intensity</span></div><div><b>G</b><span>green intensity</span></div><div><b>B</b><span>blue intensity</span></div></div></div>
            <div className="rgb-lab lab-panel">
              <div className="panel-title"><span>RGB PIXEL LAB</span><small>{rgbHex}</small></div>
              <div className="rgb-workbench">
                <div className="rgb-swatch" style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}><span>one pixel, enlarged</span></div>
                <div className="rgb-controls">
                  {[["R", red, setRed], ["G", green, setGreen], ["B", blue, setBlue]].map(([label, value, setter]) => <label key={label as string}><b>{label as string}</b><input type="range" min="0" max="255" value={value as number} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} /><span>{value as number}</span><code>{(value as number).toString(2).padStart(8, "0")}</code></label>)}
                </div>
              </div>
              <div className="pixel-explanation"><div className="pixel-mosaic" aria-label="A tiny image made from 24 coloured pixels">{samplePixels.map((colour, index) => <i key={index} style={{ backgroundColor: colour }} />)}</div><p><strong>An image is a two-dimensional grid of pixels.</strong> Each pixel stores colour values. A 1920 × 1080 image contains 2,073,600 pixels; file formats add dimensions and other metadata, and usually compress the data.</p></div>
            </div>
          </article>
        )}

        {current === 25 && (
          <article className="stage meaning-stage">
            <p className="overline">Bit patterns have no inherent meaning</p>
            <h1>A pattern needs rules that say <em>how to read it.</em></h1>
            <p className="lede">The bits do not carry a label saying “text” or “sound.” A format, data type, program, or processor supplies the interpretation.</p>
            <div className="meaning-card">
              <div className="binary-hero">01000001</div>
              <div className="interpretations"><span><small>unsigned number</small><b>65</b></span><span><small>text encoding</small><b>A</b></span><span><small>colour channel</small><b>65 / 255</b></span><span><small>audio sample</small><b>amplitude</b></span><span><small>machine code</small><b>operation*</b></span></div>
            </div>
            <div className="meaning-rule"><div><span>bits</span><b>01000001</b></div><i>+</i><div><span>interpretation rule</span><b>UTF‑8 / ASCII</b></div><i>→</i><div><span>meaning</span><b>the letter A</b></div></div>
            <div className="format-notes"><div><b>Formats provide structure</b><p>An image format says where dimensions, colour channels, pixels, and compression information belong.</p></div><div><b>Types guide programs</b><p>Python distinguishes integers, strings, bytes, images, and other objects so operations have defined meanings.</p></div><div><b>Context matters</b><p>*Machine instructions depend on a processor’s instruction set; the same byte is not one universal operation.</p></div></div>
          </article>
        )}

        {current === 26 && (
          <article className="stage final-reflection-stage">
            <div className="final-reflection-heading"><p className="overline">Return to your starting model</p><h1>What became <em>more precise?</em></h1><p className="lede">These are the answers you recorded at the start. Read them without editing, then explain what you would add, remove, or say differently now.</p></div>
            <div className="answer-review-grid">{questions.map((question, index) => <article key={question}><span>0{index + 1}</span><div><b>{question}</b><p>{answers[index].trim() || "No starting answer was recorded."}</p></div></article>)}</div>
            <label className="final-reflection"><span>Your revised model</span><b>How do physical signals, bits, patterns, logic, hardware, software layers, and interpretation work together?</b><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Explain what you understand now and how your thinking changed…" /></label>
            <div className="finish-card"><span>Lesson 01</span><div><h3>Your starting answers remain saved for comparison.</h3><p>When you are satisfied with your revised model, use “Mark Lesson Complete” below.</p></div><strong>Ready to finish</strong></div>
          </article>
        )}

        <footer className="lesson-nav">
          <button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← Previous</button>
          <span>{steps.map((_, index) => <i key={index} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} />)}</span>
          <button className="next" onClick={goNext}>{current === steps.length - 1 ? "Mark Lesson Complete" : "Next"} →</button>
        </footer>
      </section>
    </main>
  );
}
