import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDayRowComponent } from './schedule-day-row.component';

describe('ScheduleDayRowComponent', () => {
  let component: ScheduleDayRowComponent;
  let fixture: ComponentFixture<ScheduleDayRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleDayRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDayRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
