export default function splitArgs(input: string): string[] {
  // @ts-ignore
  return String(input)
    .match(/\\?.|^$/g)
    .reduce(
      (p, c) => {
        if (c === '"') {
          // @ts-ignore
          p.quote ^= 1;
          // @ts-ignore
        } else if (!p.quote && c === " ") {
          p.a.push("");
        } else {
          p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
        }
        return p;
      },
      { a: [""] }
    ).a;
}
