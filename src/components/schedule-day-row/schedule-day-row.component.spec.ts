import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDayRowComponent } from './schedule-day-row.component';
import { AppModule } from '../../app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IScheduleDay, ScheduleDay } from '../../shared/entities/schedule/ScheduleDay.ent';


describe('ScheduleDayRowComponent', () => {
  let component: ScheduleDayRowComponent;
  let fixture: ComponentFixture<ScheduleDayRowComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports:[AppModule, HttpClientTestingModule],
      declarations: [ ScheduleDayRowComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDayRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
