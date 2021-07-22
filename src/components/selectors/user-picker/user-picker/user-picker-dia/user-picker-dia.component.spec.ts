import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPickerDiaComponent } from './user-picker-dia.component';

describe('UserPickerDiaComponent', () => {
  let component: UserPickerDiaComponent;
  let fixture: ComponentFixture<UserPickerDiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPickerDiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPickerDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
