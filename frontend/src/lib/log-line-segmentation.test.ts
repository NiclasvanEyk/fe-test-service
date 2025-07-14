import { describe, it, expect } from "vitest";
import { generateSegments } from "./log-line-segmentation";

describe("Loglines should have proper highlighting when highlight is", () => {
  it("at the start", () => {
    const segments = generateSegments("Foo Bar Baz", [[0, 2]]);

    expect(segments).toEqual([
      { text: "Foo", highlighted: true },
      { text: " Bar Baz", highlighted: false },
    ]);
  });

  it("in the middle", () => {
    const segments = generateSegments("Foo Bar Baz", [[3, 7]]);

    expect(segments).toEqual([
      { text: "Foo", highlighted: false },
      { text: " Bar ", highlighted: true },
      { text: "Baz", highlighted: false },
    ]);
  });

  it("at the end", () => {
    const segments = generateSegments("Foo Bar Baz", [[8, 10]]);

    expect(segments).toEqual([
      { text: "Foo Bar ", highlighted: false },
      { text: "Baz", highlighted: true },
    ]);
  });
});
