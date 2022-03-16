import Observer from ".";

const observer = new Observer<string>("first");
let subscribedValue: string | undefined;

test("data", () => {
  expect(observer.data).toBe("first");
});

test("subscription", () => {
  observer.subscribe((data) => (subscribedValue = data));

  expect(subscribedValue).toBe(undefined);

  observer.setData("second");

  expect(subscribedValue).toBe("second");
});

test("undetected", () => {
  observer.subscribe((data) => (subscribedValue = data));
  observer.setDataUndetected("third");

  expect(subscribedValue).toBe("second");
  expect(observer.data).toBe("third");

  observer.setData("fourth");

  expect(subscribedValue).toBe("fourth");
});
