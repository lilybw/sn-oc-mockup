export class ConcurrentLoader<T,R> {
    private _map: Map<T, Promise<R>> = new Map<T, Promise<R>>();
    private _retrievalFunction: (item: T) => Promise<R>;
    private _finishedMap: Map<T, R | undefined> = new Map<T, R | undefined>();
    keys: T[] = [];

    constructor(array: T[], loader: (item: T) => Promise<R>) {
        this.keys = array;
        this._retrievalFunction = loader;
    }

    beginLoading(): void {
        this.keys.forEach((key: T) => {
            this._map.set(key, this._retrievalFunction(key));
        });
    }

    async get (obj: T): Promise<R | undefined> {
        if (this._finishedMap.has(obj)) {
            //@ts-ignore
            return this._finishedMap.get(obj);
        }
        if (this._map.has(obj)) {
            const result = await this._map.get(obj);
            this._finishedMap.set(obj, result);
            return this._map.get(obj);
        }
        return undefined;
    } 

    
}
export default ConcurrentLoader;