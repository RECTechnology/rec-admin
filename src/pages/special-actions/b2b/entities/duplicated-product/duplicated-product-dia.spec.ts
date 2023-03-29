import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DuplicatedProduct } from './duplicated-product.dia';

describe('Add item dialog tests', () => {
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    component: DuplicatedProduct,
  };

  let component: DuplicatedProduct;
  let fixture: ComponentFixture<DuplicatedProduct>;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      providers: [AppService, { provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicatedProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
