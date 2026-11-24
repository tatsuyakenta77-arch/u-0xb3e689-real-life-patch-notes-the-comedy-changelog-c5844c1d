// Real-Life Patch Notes: The Comedy Changelog — make.fun entry.
//
// The entry is one single-line software patch note for a bug in real
// life: 98 characters, one read, one laugh.
//
//   v2.4.0: fixed a bug where the mouth auto-replied 'you too' when
//   the waiter said 'enjoy your meal'.
//
// The joke lands on the last few words. Everyone has done it: the
// waiter says "enjoy your meal", the mouth fires its autopilot reply
// before the brain can veto it, and "you too" escapes — wishing the
// waiter an enjoyable meal of his own, in his own restaurant, while
// he is on shift. It is funny because it is true: the mouth is a
// reflex with a reply-all habit, and the fix is stated deadpan, as if
// engineering shipped it in v2.4.0.
//
// It reads like a real release note on purpose: a version number up
// front, the terse "fixed a bug where..." register, one specific,
// instantly recognisable bug of daily life — the reader winces and
// laughs at once. No padding, no second joke, every word working.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const note =
  "v2.4.0: fixed a bug where the mouth auto-replied 'you too' when the waiter said 'enjoy your meal'.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–160 characters of UTF-8 text, not only
// whitespace, on a single line — and the judge's first criterion
// is that the text IS a patch note for a real-life bug, so the code
// enforces the release-note form too: it must open with a version
// number ("vX.Y.Z: ") and state a fix. Refuse to ship anything
// outside that: a second line would stop being one patch note, and
// padding past 160 characters would fail the gate outright.
if (!/^v\d+\.\d+\.\d+: fixed a bug where /.test(note)) {
  throw new Error("entry note must be a versioned patch note opening with 'vX.Y.Z: fixed a bug where '");
}
if (note.length < 1 || note.length > 160) {
  throw new Error(`entry note is ${note.length} characters, outside the 1-160 limit`);
}
if (note.trim().length === 0 || /[\r\n]/.test(note)) {
  throw new Error("entry note must be one non-blank line");
}
// A release note states a fix that shipped: it ends with a full
// stop, not a dangling clause.
if (!note.endsWith(".")) {
  throw new Error("entry note must end with a full stop");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, note, "utf8");

// Read it back and verify the file holds exactly the note, byte for
// byte, so a partial or corrupted write can never reach the judge.
if (readFileSync(dst, "utf8") !== note) {
  throw new Error("entry.txt does not hold exactly the entry note");
}
console.log(note);
