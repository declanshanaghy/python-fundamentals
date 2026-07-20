import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the syllabus as the homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Computing from First Principles<\/title>/i);
  assert.match(html, /Course syllabus/);
  assert.match(html, /Learn the machine/);
  assert.match(html, /How can 0 and 1 make all of this/);
  assert.match(html, /Execution, state, and debugging/);
  assert.match(html, /Values, variables, and state/);
  assert.match(html, /Collections and data structures/);
  assert.match(html, /Open lesson/);
  assert.match(html, /aria-label="Open Lesson 01:/);
  assert.match(html, /aria-label="Open Lesson 02:/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships course metadata and removes the starter preview", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage\.setItem\("cfp-lesson-1-v8"/);
  assert.match(page, /localStorage\.setItem\("cfp-lesson-2-v1"/);
  assert.match(page, /Userspace APIs & services/);
  assert.match(page, /Kernel & drivers/);
  assert.match(page, /print\(&quot;Hello&quot;\)/);
  assert.match(page, /Windows Server/);
  assert.match(page, /Android/);
  assert.match(page, /iOS/);
  assert.match(page, /DISK I\/O/);
  assert.match(page, /NETWORK I\/O/);
  assert.match(page, /PCI Express \(PCIe\)/);
  assert.match(page, /Direct memory access/);
  assert.match(page, /RGB PIXEL LAB/);
  assert.match(page, /Completed ✓/);
  assert.match(page, /cfp-course-completed-v1/);
  assert.match(page, /gmail\.com/);
  assert.match(page, /What many people call “a router”/);
  assert.match(page, /SMTP/);
  assert.match(page, /Explain this step/);
  assert.match(page, /Security protocol/);
  assert.match(page, /aria-haspopup="dialog"/);
  assert.match(page, /Domain Name System \(DNS\)/);
  assert.match(page, /Transport Layer Security \(TLS\)/);
  assert.match(page, /Hypertext Transfer Protocol Secure \(HTTPS\)/);
  assert.match(page, /Transmission Control Protocol \/ Internet Protocol \(TCP\/IP\)/);
  assert.match(page, /Example: how it works/);
  assert.match(page, /BIT PATTERN LAB/);
  assert.match(page, /useState\(1\);\n  const \[pattern, setPattern\] = useState\(1\)/);
  assert.match(page, /Click any bit/);
  assert.match(page, /byte value =/);
  assert.match(page, /HALF ADDER/);
  assert.match(page, /Truth table/);
  assert.match(page, /Every possible input combination and its result/);
  assert.match(page, /A XOR B =/);
  assert.match(page, /full adder/);
  assert.match(page, /FULL ADDER/);
  assert.match(page, /CARRY IN/);
  assert.match(page, /CARRY OUT/);
  assert.match(page, /HALF ADDER 2/);
  assert.match(page, /0111 \+ 0001/);
  assert.match(page, /gate-input-wires/);
  assert.ok(page.indexOf('label: "Binary patterns"') < page.indexOf('label: "Bits & bytes"'));
  assert.match(page, /CALL STACK/);
  assert.match(page, /broken_total\.py/);
  assert.match(page, /Lesson 02/);
  assert.match(layout, /Computing from First Principles/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
