import range from ".";

test("range", () => {
  for (const n of range(0, 6, 2)) {
    console.log(n);
  }
});
