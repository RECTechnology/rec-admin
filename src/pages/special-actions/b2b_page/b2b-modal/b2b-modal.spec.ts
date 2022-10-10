import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { AddB2BModal } from './b2b-modal';
import { MatDialogRef } from '@angular/material/dialog';
import { SendTransactionsDia } from '../../change_delegate/components/new_massive_transactions/send_transaction_modal/send_transactions_modal';




describe('AddB2BModal tests', () => {

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        component: SendTransactionsDia
    }

    
    let component: AddB2BModal;
    let fixture: ComponentFixture<AddB2BModal>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService, { provide: MatDialogRef, useValue: mockDialogRef}]
        })
        .compileComponents();

        fixture = TestBed.createComponent(AddB2BModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});