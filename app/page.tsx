"use client";

import { useEffect, useMemo, useState } from "react";

const steps = [
  { id: "model", number: "01", label: "Your model", eyebrow: "Start with what you know" },
  { id: "instructions", number: "02", label: "Precise instructions", eyebrow: "Think like a computer" },
  { id: "signals", number: "03", label: "Signals to bits", eyebrow: "The physical foundation" },
  { id: "logic", number: "04", label: "Logic & patterns", eyebrow: "Simple pieces, combined" },
  { id: "layers", number: "05", label: "The abstraction ladder", eyebrow: "From circuits to Python" },
  { id: "debugger", number: "06", label: "Watch a program run", eyebrow: "Prediction meets reality" },
  { id: "meaning", number: "07", label: "Meaning & reflection", eyebrow: "Interpretation creates meaning" },
] as const;

const questions = [
  "What is a computer?",
  "What do ‘ones and zeros’ actually mean?",
  "How could two symbols represent a picture, song, or game?",
  "What do you think happens when Python code runs?",
];

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

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));
  const [bitCount, setBitCount] = useState(3);
  const [pattern, setPattern] = useState(5);
  const [gateA, setGateA] = useState(true);
  const [gateB, setGateB] = useState(false);
  const [gate, setGate] = useState<"AND" | "NOT">("AND");
  const [teaOrder, setTeaOrder] = useState(teaSteps);
  const [teaMessage, setTeaMessage] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [traceLine, setTraceLine] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cfp-lesson-1") || "{}");
      if (Array.isArray(saved.completed)) setCompleted(saved.completed);
      if (Array.isArray(saved.answers)) setAnswers(saved.answers);
      if (typeof saved.notes === "string") setNotes(saved.notes);
      if (Number.isInteger(saved.current)) setCurrent(Math.min(saved.current, steps.length - 1));
    } catch { /* Begin fresh if local data is malformed. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("cfp-lesson-1", JSON.stringify({ completed, answers, notes, current }));
  }, [completed, answers, notes, current]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") setCurrent((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const binary = useMemo(() => pattern.toString(2).padStart(bitCount, "0"), [pattern, bitCount]);
  const gateResult = gate === "AND" ? gateA && gateB : !gateA;
  const progress = Math.round((completed.length / steps.length) * 100);

  function goNext() {
    setCompleted((value) => value.includes(current) ? value : [...value, current]);
    setCurrent((value) => Math.min(steps.length - 1, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setTeaMessage(correct ? "The literal computer made the tea. Sequence matters." : "The computer followed your exact order—and the tea went wrong. Find the earliest impossible step.");
  }

  function stepTrace() {
    setTraceLine((line) => line >= 5 ? 0 : line + 1);
  }

  const variables: Record<string, string | number> = {};
  if (traceLine >= 1) variables.first_number = 6;
  if (traceLine >= 2) variables.second_number = 7;
  if (traceLine >= 3) variables.answer = 13;

  return (
    <main className="course-shell">
      <header className="topbar">
        <a className="brand" href="#lesson" aria-label="Computing from First Principles home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><strong>Computing</strong><small>from first principles</small></span>
        </a>
        <div className="course-progress" aria-label={`${progress}% of lesson complete`}>
          <span>Lesson progress</span>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
        </div>
        <span className="lesson-tag">Course · Lesson 01</span>
      </header>

      <aside className="sidebar" aria-label="Lesson stages">
        <div className="sidebar-intro">
          <span className="signal-dot" />
          <small>Lesson 01 · 60–75 min</small>
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
          <article className="stage hero-stage">
            <p className="overline">Before we add anything</p>
            <h1>Let’s make your current model <em>visible.</em></h1>
            <p className="lede">There are no trick questions here. Write what you think today. At the end, you’ll revisit these answers and notice what changed.</p>
            <div className="question-grid">
              {questions.map((question, index) => (
                <label className="question-card" key={question}>
                  <span><b>0{index + 1}</b>{question}</span>
                  <textarea value={answers[index]} onChange={(event) => setAnswers((all) => all.map((answer, i) => i === index ? event.target.value : answer))} placeholder="Write your best current explanation…" />
                </label>
              ))}
            </div>
            <div className="principle"><span>Working rule</span><p>Being wrong is useful when we can say exactly what we predicted.</p></div>
          </article>
        )}

        {current === 1 && (
          <article className="stage">
            <p className="overline">An algorithm is a precise procedure</p>
            <h1>Can a very literal machine <em>make tea?</em></h1>
            <p className="lede">A computer cannot fill in the gaps with common sense. Put the instructions in a workable order, then run them.</p>
            <div className="tea-lab lab-panel">
              <div className="panel-title"><span>TEA_ALGORITHM.txt</span><small>Order matters</small></div>
              <ol>
                {teaOrder.map((step, index) => (
                  <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span><div><button onClick={() => moveTea(index, -1)} aria-label={`Move ${step} up`}>↑</button><button onClick={() => moveTea(index, 1)} aria-label={`Move ${step} down`}>↓</button></div></li>
                ))}
              </ol>
              <button className="run-button" onClick={runTea}><span>▶</span> Run instructions</button>
              {teaMessage && <p className="lab-message" role="status">{teaMessage}</p>}
            </div>
            <div className="concept-row">
              <div><b>Sequence</b><p>Which instruction happens first?</p></div><div><b>Input & output</b><p>What goes in, and what should come out?</p></div><div><b>Decisions</b><p>What changes when a condition is true?</p></div><div><b>Repetition</b><p>Which steps happen again?</p></div>
            </div>
          </article>
        )}

        {current === 2 && (
          <article className="stage">
            <p className="overline">The physical foundation</p>
            <h1>Computers don’t contain tiny <em>ones and zeros.</em></h1>
            <p className="lede">Electronic circuits produce continuously varying physical signals. Digital circuits classify reliable ranges as two states. We label those states <strong>0</strong> and <strong>1</strong>.</p>
            <div className="signal-visual">
              <div className="scope-grid"><span className="scope-line" /><i className="pulse p1" /><i className="pulse p2" /><i className="pulse p3" /></div>
              <div className="threshold"><span>HIGH RANGE → label 1</span><i /><span>LOW RANGE → label 0</span></div>
            </div>
            <div className="callout-grid">
              <div className="callout amber"><span>Important nuance</span><h3>The world is analogue.</h3><p>“Digital” describes how a circuit interprets physical ranges, not a universe made from literal digits.</p></div>
              <div className="callout"><span>A bit</span><h3>One reliable choice.</h3><p>A bit is the smallest binary distinction: off/on, low/high, 0/1.</p></div>
            </div>
          </article>
        )}

        {current === 3 && (
          <article className="stage">
            <p className="overline">Combine simple pieces</p>
            <h1>Patterns multiply. Gates give them <em>rules.</em></h1>
            <div className="two-labs">
              <div className="lab-panel bit-lab">
                <div className="panel-title"><span>BIT PATTERN LAB</span><small>{bitCount} bits → {2 ** bitCount} patterns</small></div>
                <div className="bit-display">{binary.split("").map((bit, index) => <div key={index}><BitLamp on={bit === "1"} /><b>{bit}</b></div>)}</div>
                <label>Number of bits <input type="range" min="1" max="8" value={bitCount} onChange={(e) => { const next = Number(e.target.value); setBitCount(next); setPattern((value) => Math.min(value, 2 ** next - 1)); }} /><strong>{bitCount}</strong></label>
                <label>Pattern value <input type="range" min="0" max={2 ** bitCount - 1} value={pattern} onChange={(e) => setPattern(Number(e.target.value))} /><strong>{pattern}</strong></label>
                <p><strong>{binary}</strong> is one of <strong>{2 ** bitCount}</strong> possible patterns.</p>
              </div>
              <div className="lab-panel gate-lab">
                <div className="panel-title"><span>LOGIC GATE</span><div><button className={gate === "AND" ? "selected" : ""} onClick={() => setGate("AND")}>AND</button><button className={gate === "NOT" ? "selected" : ""} onClick={() => setGate("NOT")}>NOT</button></div></div>
                <div className="gate-machine">
                  <button onClick={() => setGateA(!gateA)}><BitLamp on={gateA} /> A = {Number(gateA)}</button>
                  {gate === "AND" && <button onClick={() => setGateB(!gateB)}><BitLamp on={gateB} /> B = {Number(gateB)}</button>}
                  <span className="gate-shape">{gate}</span><i className="wire" /><div className={`output ${gateResult ? "on" : ""}`}><BitLamp on={gateResult} /> OUT = {Number(gateResult)}</div>
                </div>
                <p>{gate === "AND" ? "AND outputs 1 only when both inputs are 1." : "NOT reverses its input: 1 becomes 0, and 0 becomes 1."}</p>
              </div>
            </div>
            <div className="prediction-box"><b>Predict first</b><span>How many patterns can 8 bits represent?</span>{prediction === null ? <div><button onClick={() => setPrediction("128")}>128</button><button onClick={() => setPrediction("256")}>256</button><button onClick={() => setPrediction("512")}>512</button></div> : <p className={prediction === "256" ? "correct" : "incorrect"}>{prediction === "256" ? "Exactly. Each added bit doubles the possibilities: 2⁸ = 256." : "Good prediction to test. Each of 8 bits has two choices, so 2⁸ = 256."} <button onClick={() => setPrediction(null)}>Try again</button></p>}</div>
          </article>
        )}

        {current === 4 && (
          <article className="stage">
            <p className="overline">Completed complexity becomes a building block</p>
            <h1>Each layer provides a service—and <em>hides details.</em></h1>
            <p className="lede">You can write Python without controlling individual transistors because every layer gives the next one a simpler set of ideas to work with.</p>
            <div className="ladder">
              <div className="ladder-head"><span>Layer</span><span>What it provides</span><span>What it lets us ignore</span></div>
              {ladder.map((layer, index) => <div className={`ladder-row layer-${index}`} key={layer.name}><b>{layer.name}</b><span>{layer.gives}</span><span>{layer.hides}</span></div>)}
            </div>
            <blockquote>Complexity is built by combining simple operations, then hiding completed complexity behind useful abstractions.</blockquote>
            <div className="flow-strip"><span>Python source</span><i>→</i><span>Python runtime</span><i>→</i><span>Operating system</span><i>→</i><span>CPU instructions</span><i>→</i><span>Electrical state</span></div>
          </article>
        )}

        {current === 5 && (
          <article className="stage">
            <p className="overline">Your first debugger model</p>
            <h1>Make a prediction. Then watch <em>state change.</em></h1>
            <p className="lede">A debugger pauses a running program so you can inspect what it knows. Press “Step over” and explain what the highlighted line will change <strong>before</strong> you run it.</p>
            <div className="debugger">
              <div className="editor lab-panel">
                <div className="panel-title"><span>lesson_01.py</span><small>● paused</small></div>
                <div className="code-lines">{codeLines.map((line) => <div key={line.n} className={traceLine < 5 && line.n === traceLine + 1 ? "active-line" : ""}><span>{line.n}</span><code>{line.text || " "}</code></div>)}</div>
                <button className="run-button" onClick={stepTrace}>{traceLine >= 5 ? "↺ Reset" : "↧ Step over"}</button>
              </div>
              <div className="inspectors">
                <div className="inspector"><div className="panel-title"><span>VARIABLES</span><small>Local</small></div>{Object.keys(variables).length ? Object.entries(variables).map(([key, value]) => <p key={key}><span>{key}</span><b>{value}</b></p>) : <em>No variables yet</em>}</div>
                <div className="inspector"><div className="panel-title"><span>CALL STACK</span></div><p><span>lesson_01.py</span><b>line {Math.min(traceLine + 1, 5)}</b></p></div>
                <div className="inspector console"><div className="panel-title"><span>TERMINAL</span></div><code>{traceLine >= 5 ? "> 13" : "> _"}</code></div>
              </div>
            </div>
            <div className="principle"><span>Debugging principle</span><p>Find the earliest place where reality differs from your prediction.</p></div>
          </article>
        )}

        {current === 6 && (
          <article className="stage">
            <p className="overline">Bit patterns have no inherent meaning</p>
            <h1>The pattern stays the same. Its <em>interpretation</em> changes.</h1>
            <div className="meaning-card">
              <div className="binary-hero">01000001</div>
              <div className="interpretations"><span><small>as a number</small><b>65</b></span><span><small>as text</small><b>A</b></span><span><small>as colour data</small><b className="colour-chip" /></span><span><small>as sound</small><b>▁▃▇▅▂</b></span><span><small>as an instruction</small><b>operation</b></span></div>
            </div>
            <div className="code-compare"><pre><span>number</span> = 65{"\n"}<span>letter</span> = chr(number){"\n\n"}print(number)  <i># 65</i>{"\n"}print(letter)  <i># A</i></pre><pre><span>letter</span> = "A"{"\n"}<span>number</span> = ord(letter){"\n\n"}print(letter)  <i># A</i>{"\n"}print(number)  <i># 65</i></pre></div>
            <label className="reflection"><span>Explain it back</span><b>How can simple physical states become a complex game, song, or program?</b><small>Try to use: physical states, bits, patterns, logic gates, processor, instructions, layers, abstraction, and speed.</small><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Build your explanation in your own words…" /></label>
            <div className="finish-card"><span>Lesson 01</span><div><h3>You’ve reached the top of the ladder.</h3><p>Now compare this explanation with your answers from Stage 1. What became more precise?</p></div><button onClick={() => setCurrent(0)}>Review my first answers ↗</button></div>
          </article>
        )}

        <footer className="lesson-nav">
          <button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← Previous</button>
          <span>{steps.map((_, index) => <i key={index} className={`${index === current ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} />)}</span>
          <button className="next" onClick={goNext}>{current === steps.length - 1 ? "Mark lesson complete" : "Complete & continue"} →</button>
        </footer>
      </section>
    </main>
  );
}
