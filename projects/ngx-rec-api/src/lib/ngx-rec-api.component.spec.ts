import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRecApiComponent } from './ngx-rec-api.component';

describe('NgxRecApiComponent', () => {
  let component: NgxRecApiComponent;
  let fixture: ComponentFixture<NgxRecApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRecApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRecApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
