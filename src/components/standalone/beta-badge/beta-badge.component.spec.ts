import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaBadgeComponent } from './beta-badge.component';

describe('BetaBadgeComponent', () => {
  let component: BetaBadgeComponent;
  let fixture: ComponentFixture<BetaBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetaBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
