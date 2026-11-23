import { describe, expect, it } from "vitest";

import { FORM_CUES, formCues } from "./form-cues";
import { PROGRAM } from "./program-data";

describe("form cues", () => {
  it("has cues for every step of every movement", () => {
    for (const m of PROGRAM) {
      expect(FORM_CUES[m.slug]).toHaveLength(m.steps.length);
      m.steps.forEach((_, i) => expect(formCues(m.slug, i + 1).length).toBeGreaterThan(0));
    }
  });
});
