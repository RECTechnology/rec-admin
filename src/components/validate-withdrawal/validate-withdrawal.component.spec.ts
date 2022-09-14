import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { ValidateWithdrawalComponent } from './validate-withdrawal.component';
import { AppService } from '../../services/app/app.service';

describe('ValidateWithdrawalComponent', () => {
  let component: ValidateWithdrawalComponent;
  let fixture: ComponentFixture<ValidateWithdrawalComponent>;

  afterEach(() => {
    TestBed.resetTestingModule();
  }); beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      declarations: [ ValidateWithdrawalComponent ],
      providers: [AppService]
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
