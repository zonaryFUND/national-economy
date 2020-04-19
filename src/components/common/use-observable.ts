import * as React from "react";
import { Subscription } from "rxjs";

export default function useObservable(observe: () => Subscription) {
    const [subscription, setSubscription] = React.useState<Subscription | null>(null);
    const ref = React.useRef(subscription);

    React.useEffect(() => {
        setSubscription(observe());
        return () => ref.current?.unsubscribe();
    }, []);
}