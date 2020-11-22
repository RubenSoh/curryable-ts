type Args = readonly unknown[]

// https://github.com/microsoft/TypeScript/issues/23689#issuecomment-388563202
type Invalid<Message> = Message | void | never

export type Curry<Remaining extends Args, Return> =
    <A extends Args>(...args: A) =>
        // If the user has passed in the remaining parameters (and/or extra)
        A extends [...Remaining, ...Args]
            // Return the return value
            ? Return
            // If the user has passed in part of the parameters
            // Preferably we'd like something like `[...A, ...infer Tail] extends Remaining`
            // but typescript doesn't like this
            : Remaining extends [...A, ...infer Tail]
                // Assert that none of the elements of A are a supertype of
                // the elements of Remaining.
                ? [...A, ...Tail] extends Remaining
                    // Return a function that curries the rest (Tail) of the parameters
                    ? Curry<Tail, Return>
                    : Invalid<{
                        msg: "Invalid curried function parameters (A)",
                        expected: Remaining,
                        received: A
                    }>
                : Invalid<{
                    msg: "Invalid curried function parameters (B)",
                    expected: Remaining,
                    received: A
                }>


export function curryable<A extends Args, R>(
    fn: (...args: A) => R,
    size: number = fn.length
): Curry<A, R> {
    return function curry(...args: any) {
        if (args.length >= size) {
            return fn(...args)
        } else {
            return (...xs: any) => curry(...xs, ...args)
        }
    } as any
}