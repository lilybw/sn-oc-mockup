export interface IDeepCopyable<T> {
    deepCopy: () => T;
}
export interface Buffer<T extends IDeepCopyable<T>> {
    push: (data: T) => Number;
    pushAll: (data: T[]) => Number;
    retrieve: () => T[];
    deepCopy: () => T[];
    size: () => Number;
    clear: () => void;
} 

export class SimpleBuffer<T extends IDeepCopyable<T>> implements Buffer<T> {
    private _buffer: T[] = [];

    //Adds a single element to the buffer
    push(data: T): Number {
        return this._buffer.push(data);
    }

    //Uses spread syntax to add all elements of the array to the buffer
    pushAll(data: T[]): Number {
        return this._buffer.push(...data);
    }

    //Deep copies the buffer, then empties it and returns the copy
    retrieve(): T[] {
        const pointerSwap = this._buffer; 
        this._buffer = [];
        return pointerSwap;
    }

    //Empties the buffer
    clear(): void {
        this._buffer.length = 0;
    }
    
    //Deep copies the buffer and returns the copy. Does not empty the buffer
    deepCopy(): T[] {
        const newArray: Array<T> = new Array<T>(this._buffer.length);
        for (let i = 0; i < this._buffer.length; i++) {
            newArray[i] = this._buffer[i].deepCopy();
        }
        return newArray;
    }

    //Returns the size of the buffer
    size(): Number {
        return this._buffer.length;
    }
}
export default SimpleBuffer;