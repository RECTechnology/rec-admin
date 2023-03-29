import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { AddProductDia } from './add-product.dia';
import { MatDialogRef } from '@angular/material/dialog';

describe('Add item dialog tests', () => {
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    component: AddProductDia,
  };

  let component: AddProductDia;
  let fixture: ComponentFixture<AddProductDia>;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      providers: [AppService, { provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
