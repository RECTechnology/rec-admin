import { Injectable, EventEmitter } from '@angular/core';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { noop } from 'rxjs/internal/util/noop';

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

    public fireEvent(name, args: any[] = [], done?: () => any) {
        if (this.findEvent(name)) {
            console.log(this.events[name]);
            if (done) {
                this.events[name].observers.unshift(new Subscriber(noop, noop, done));
                // this.events[name].subscribe(done);
            }

            this.events[name].emit(args);
        }
        return this.events[name];
    }
}
