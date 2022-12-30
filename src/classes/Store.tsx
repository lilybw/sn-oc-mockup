export default class Store <T> {
    __value?: T;
    listeners: Map<any,(newValue: T, previousValue?: T) => void> = new Map();

    constructor(value?: T) {
        this.__value = value;
    }

    public listen = (identifier: any, listener: (newValue: T, previousValue?: T) => void): void => {
        this.listeners.set(identifier, listener);
    }
    public ignore = (identifier: any): void => {
        this.listeners.delete(identifier);
    }

    public set(newValue: T) {
        const previous = this.__value;
        this.__value = newValue;
        this.listeners.forEach((identifier, listener) => {
            listener(newValue, previous);
        });
    }
}