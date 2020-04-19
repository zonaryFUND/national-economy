import { Observable } from "rxjs";

export default interface Repository<T> {
    stream: Observable<T>;
}