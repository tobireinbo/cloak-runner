import Tree from ".";

const rootNode = new Tree<string>("Hello");

test("root id and data", () => {
  expect(rootNode.id).toBe(0);
  expect(rootNode.data).toBe("Hello");
});

test("add child", () => {
  rootNode.addChild(new Tree<string>("World"));

  expect(rootNode.children[0]).toMatchObject({ _id: 1, _data: "World" });
});

test("find nested", () => {
  const nestedNode = new Tree<string>("Deep!");
  rootNode.children[0].addChild(nestedNode);

  expect(rootNode.findById(2)).toBe(nestedNode);
});
