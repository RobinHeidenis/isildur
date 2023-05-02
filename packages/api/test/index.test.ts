import { add } from "../src/add";

test('adds 1 + 2 to equal 3', () => {
    expect(add(2, 3)).toBe(5);
});