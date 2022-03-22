import Observable from ".";

const observer = new Observable<string>("first");
let subscribedValue: string | undefined;

test("data", () => {
  expect(observer.data).toBe("first");
});

test("subscription", () => {
  observer.subscribe((data) => (subscribedValue = data));

  expect(subscribedValue).toBe(undefined);

  observer.broadcast("second");

  expect(subscribedValue).toBe("second");
});

test("undetected", () => {
  observer.subscribe((data) => (subscribedValue = data));
  observer.set("third");

  expect(subscribedValue).toBe("second");
  expect(observer.data).toBe("third");

  observer.set("fourth").broadcast();

  expect(subscribedValue).toBe("fourth");
});

test("increment prev", () => {
  const numberObserver = new Observable(0);
  numberObserver.set((prev) => prev + 1);
  expect(numberObserver.data).toBe(1);
});
