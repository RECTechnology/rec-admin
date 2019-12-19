import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventsService {
    public events: { [key: string]: EventEmitter<any> } = {};

    public registerEvent<T>(name) {
        const event: EventEmitter<T> = new EventEmitter();
        this.events[name] = event;

        return event;
    }

    public findEvent(name): EventEmitter<any> {
        return this.events[name];
    }

    public fireEvent(name, ...args: any[]) {
        if (this.findEvent(name)) {
            this.events[name].emit(...args);
        }
    }
}
