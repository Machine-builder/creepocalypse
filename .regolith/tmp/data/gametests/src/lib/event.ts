// Types

type FunctionWithArgType<T> = (arg: T) => void;

// Classes

export class GenericEventSignal<arg> {
    callbacks: FunctionWithArgType<arg>[];

    constructor() {
        this.callbacks = [];
    }

    subscribe(callback: FunctionWithArgType<arg>) {
        this.callbacks.push(callback);
    }

    trigger(arg: arg) {
        for (const callback of this.callbacks) {
            callback(arg);
        }
    }
}