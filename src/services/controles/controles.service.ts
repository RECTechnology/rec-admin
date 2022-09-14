import { UtilsService } from './../utils/utils.service';
import { Injectable } from '@angular/core';

type ToggleFn = (toggled: boolean) => void;

@Injectable()
export class ControlesService {
  public handlers = new Map<string, ToggleFn[]>();
  public toggles = {
    sidemenu: true,
    UsersAndAccounts: true,
  };

  constructor(
    public utils: UtilsService,
  ) {
    this.toggles.sidemenu = !utils.isMobileDevice;
  }

  public toggle(name) {
    const toggled = this.toggles[name] ? !this.toggles[name] : true;
    this.toggles[name] = toggled;
    if (this.handlers.has(name)) {
      const fns = this.handlers.get(name);
      fns.forEach((fn) => fn(toggled));
    }
  }

  public addHandler(name: string, cback: ToggleFn) {
    let fns = [];
    if (this.handlers.has(name)) {
      fns = this.handlers.get(name);
    }

    const index = fns.push(cback);
    this.handlers.set(name, fns);

    return { remove: this.removeHandler.bind(this, name, index) };
  }

  public removeHandler(name, index: number) {
    if (this.handlers.has(name)) {
      const fns = this.handlers.get(name);
      fns.splice(index, 1);
      this.handlers.set(name, fns);
    }
  }

  public isToggled(name) {
    return this.toggles[name];
  }
}
