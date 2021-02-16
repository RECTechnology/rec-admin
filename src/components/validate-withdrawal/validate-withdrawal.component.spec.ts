import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateWithdrawalComponent } from './validate-withdrawal.component';

describe('ValidateWithdrawalComponent', () => {
  let component: ValidateWithdrawalComponent;
  let fixture: ComponentFixture<ValidateWithdrawalComponent>;

  afterEach(() => {
    TestBed.resetTestingModule();
  }); beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateWithdrawalComponent ]
    })
    .compileComponents();
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  }); beforeEach(() => {
    fixture = TestBed.createComponent(ValidateWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
