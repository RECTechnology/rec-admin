import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { AddNeighbourhoodDia } from './add.dia';
import { MatDialogRef } from '@angular/material/dialog';




describe('Add neighbourhood dia tests', () => {

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        component: AddNeighbourhoodDia
    }

    
    let component: AddNeighbourhoodDia;
    let fixture: ComponentFixture<AddNeighbourhoodDia>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService, {provide: MatDialogRef, useValue: mockDialogRef}]
        })
        .compileComponents();

        fixture = TestBed.createComponent(AddNeighbourhoodDia);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});