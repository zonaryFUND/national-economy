export function fisherYatesShuffle<T>(array: Array<T>): Array<T> {
    let shuffled = array;
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}