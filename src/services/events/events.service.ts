import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventsService {
    public events: { [key: string]: EventEmitter<any> } = {};

    public registerEvent<T>(name) {
        const event: EventEmitter<T> = new EventEmitter();
        this.events[name] = event;

        return event;
    }

    public removeEvent(name) {
        this.events[name].unsubscribe();
        delete this.events[name];
    }

    public findEvent(name): EventEmitter<any> {
        return this.events[name];
    }

    public fireEvent(name, ...args: any[]) {
        if (this.findEvent(name)) {
            this.events[name].emit(...args);
        }
        return this.events[name];
    }
}
