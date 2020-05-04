import * as React from "react";
import { Subscription, Observable } from "rxjs";

export default function useObservable<T>(observable: Observable<T>): [T | null, any | null, () => void] {
    const [subscription, setSubscription] = React.useState<Subscription | null>(null);
    const [value, setValue] = React.useState<T | null>(null);
    const [error, setError] = React.useState<any | null>(null);

    const ref = React.useRef(subscription);

    React.useEffect(() => {
        setSubscription(observable.subscribe(v => {
            setValue(v)
        }, setError));
        return () => ref.current?.unsubscribe();
    }, []);

    return [value, error, () => subscription?.unsubscribe()];
}