import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogViewComponent } from './log-view.component';
import { AppModule } from '../../app/app.module';

describe('LogViewComponent', () => {
  let component: LogViewComponent;
  let fixture: ComponentFixture<LogViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ LogViewComponent ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
