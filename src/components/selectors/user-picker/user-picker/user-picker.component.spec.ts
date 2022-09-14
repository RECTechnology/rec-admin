import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPickerComponent } from './user-picker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';

describe('UserPickerComponent', () => {
  let component: UserPickerComponent;
  let fixture: ComponentFixture<UserPickerComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports:[AppModule, HttpClientTestingModule],
      declarations: [UserPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
