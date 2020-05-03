export default class State<S, T> {
    readonly run: (s: S) => [T, S];
    constructor(run: (s: S) => [T, S]) {
        this.run = run;
    }

    static returnS<S, T>(t: T): State<S, T> {
        return new State(s => [t, s]);
    }

    flatMap<Tr>(f: (t: T) => State<S, Tr>): State<S, Tr> {
        return new State(s => {
            const [tr, sr] = this.run(s);
            return f(tr).run(sr);
        });
    }

    static get<S>(): State<S, S> {
        return new State(s => [s, s]);
    }

    static put<S>(s: S): State<S, void> {
        return new State(_ => [undefined, s]);
    }

    modify(f: (s: S) => S): State<S, T> {
        return new State(s => {
            const [t, sin] = this.run(s);
            return [t, f(sin)];
        });
    }

    map<Tr>(f: (t: T) => Tr): State<S, Tr> {
        return new State(s => {
            const [t, sr] = this.run(s);
            return [f(t), sr];
        });
    }

    debug(withS?: (s: S) => string, withT?: (t: T) => string): State<S, T> {
        return new State(s => {
            const result = this.run(s);
            if (withS) {
                withS(result[1]);
            }
            if (withT) {
                withT(result[0]);
            }
            if (!withS && !withT) {
                console.log(result);
            }
            return result;
        });
    }
}
