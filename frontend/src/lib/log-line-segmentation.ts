export interface Segment {
  highlighted: boolean;
  text: string;
}

export function generateSegments(
  text: string,
  regions: ReadonlyArray<[number, number]>
): Segment[] {
  const sortedRegions = [...regions].sort((a, b) => a[0] - b[0]);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const [start, end] of sortedRegions) {
    if (start > cursor) {
      segments.push({
        highlighted: false,
        text: text.slice(cursor, start),
      });
    }

    segments.push({
      highlighted: true,
      text: text.slice(start, end + 1),
    });

    cursor = end + 1;
  }

  if (cursor < text.length) {
    segments.push({
      highlighted: false,
      text: text.slice(cursor),
    });
  }
  return segments;
}
