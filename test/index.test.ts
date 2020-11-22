import { curryable } from "../index";

// Behaviour + typed tests

describe("adding", () => {
    const add = curryable((a: number, b: number) => a + b)

    test("normal", () => {
        expect(add(2, 2)).toBe(4)
    })

    test("curried", () => {
        const add2: (x: number) => number = add(2)

        expect(add2(2)).toBe(4)
    })

    test("as reducer", () => {
        const arr = [1, 2, 3, 4, 5]

        expect(arr.reduce(add)).toBe(15)
    })
})


