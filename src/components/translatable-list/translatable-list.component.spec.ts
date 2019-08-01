import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatableListComponent } from './translatable-list.component';

describe('TranslatableListComponent', () => {
  let component: TranslatableListComponent;
  let fixture: ComponentFixture<TranslatableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslatableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
