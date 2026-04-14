import assert from "node:assert/strict";
import { lifePathNumber, personalYear } from "../lib/numerology-pythagorean";
import { computeNumerologyProfile, parseNumerologyProfileBody } from "../lib/numerology-profile";

assert.equal(lifePathNumber(1, 1, 2000), 4);
assert.equal(personalYear(4, 14, 2026), 1);

const bad = parseNumerologyProfileBody({ month: 2, day: 30, year: 2026 });
assert.equal(bad.ok, false);

const ok = parseNumerologyProfileBody({ month: 1, day: 1, year: 2000, nameLatin: "", calendarYear: 2000 });
assert.equal(ok.ok, true);
if (ok.ok) {
  const profile = computeNumerologyProfile(ok.value);
  assert.equal(profile.numbers.lifePath, 4);
  assert.ok(profile.layers.snapshot.length > 10);
}

console.log("verify-numerology: ok");
