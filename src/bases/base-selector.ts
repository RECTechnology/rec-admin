import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  template: '',
  selector: 'test',
})
export abstract class BaseSelectorComponent {
  @Input() public items: any[] = [];
  @Input() public disabled: boolean = false;
  @Input() public hasParent = true;
  @Input() public sendedItems = false;
  @Input() public needsNone = false;
  @Input() public label = 'SELECTOR';
  @Input() showSelection = true;

  @Input() public item: any = null;
  @Output() public itemChanged: EventEmitter<any> = new EventEmitter();

  public itemQuery: string;
  public isLoading = false;

  /* istanbul ignore next */
  selectItem(item) {
    this.itemChanged.emit(item);
  }

  ngOnChanges( simpleChanges: SimpleChanges){
    if(simpleChanges["item"].currentValue != simpleChanges["item"].previousValue){
      this.item = simpleChanges["item"].currentValue;
      this.setInitialValue();
    }
  }

  public abstract getSearchObservable(query: string): Observable<any>;

  /** Esto es para selecciona el elemento que se el pasa,
    * porque a veces `this.item` es una copia del objecto que recibimos de la api
    * (javascript si el objeto es igual pero se copia, ya no lo trata como igual, por eso tenemos que comprobarlo por id)
    */
  public setInitialValue() {
    const selectedItemId = (this.item && this.item.id) || this.item;

    if (selectedItemId !== null) {
      const item = this.items.find((el) => el.id === selectedItemId);
      if (item) {
        this.item = item;
      }
    }
  }

  public setSelectedItem(item) {
    this.item = item;
    this.selectItem(item);
  }

  /* istanbul ignore next */
  public search(query?: string) {
    this.isLoading = true;
    
    this.getSearchObservable(query).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (Array.isArray(resp)) {
          this.items = resp;
        } else if (Array.isArray(resp.data)) {
          this.items = resp.data;
        } else {
          this.items = [];
        }

        // Esto esta aqui porque si en la primera llamada no existe `this.item` no se mostraria en el selector
        // Por tanto si `this.item` no existe en la lista que recibimos, simplemente lo añadimos para que aparezca
        // Asi podemos listar 10 inicialmente sin problemas
        if (this.item && !this.items.some((it) => it.id == this.item.id)) {
          this.items.unshift(this.item);
        }

        this.setInitialValue();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
}
