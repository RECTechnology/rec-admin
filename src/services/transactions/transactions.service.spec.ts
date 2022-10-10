import { HttpClient, HttpEvent } from "@angular/common/http";
import { UserService } from "../user.service";
import { inject, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppModule } from '../../app/app.module';
import { TransactionService } from './transactions.service';
import { WalletService } from '../wallet/wallet.service';
import { API_URL } from '../../data/consts';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let injector: TestBed;
let transactionService: TransactionService;
let userService: UserService;
let walletService: WalletService;
let api_url = 'https://api.rec.qbitartifacts.com';

let httpMock: HttpTestingController;

describe('Transaction', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ['get', 'post', 'put', 'delete']);
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule ],
            providers: [UserService, TransactionService, WalletService ]
        })
        injector = getTestBed();
        userService = testModule.inject<UserService>(UserService);
        transactionService = new TransactionService(httpClientSpy, userService, walletService);
        transactionService = injector.inject(TransactionService);
        httpMock = injector.inject(HttpTestingController);
        
    });



    afterEach(() => {
        httpMock.verify();
        httpClientSpy.get.calls.reset();
        httpClientSpy.post.calls.reset();
        httpClientSpy.put.calls.reset();
        httpClientSpy.delete.calls.reset();
    });

    it('should be created', () => {
        expect(transactionService).toBeTruthy();
    });

    it('Should return expected tx correctly(HttpClient called once)', () => {

            const expectedTx = 
            [
                {
                    access_key: "4487d886sasas46a37f829d48f0cdaaas6fa8d3a25ed3",
                    amount: '100',
                    concept:'1234',
                    created: "2020-05-11T13:57:19+00:00"
                },
                {
                    access_key: "44dsds87dsdsdd886sasas46a37f829d48f0cdaaas6fa8d3a25ed3",
                    amount: '100',
                    concept:'123ss4',
                    created: "2020-05-11T13:57:19+00:00"
                }];

               
    
             transactionService.listTx().subscribe((res) => {
                expect(res).toEqual(expectedTx);
             });

             const mockReq = httpMock.expectOne(`${API_URL}/admin/v3/transactions?finish_date=undefined&limit=undefined&search=&offset=0&order=desc&sort=sender_id&start_date=undefined`); 

            expect(mockReq.request.method).toBe('GET');
            expect(mockReq.request.responseType).toBe('json');  
    });

    it('should call refund correctly', () => {
        const response = {};

        transactionService.refundTx('concept', 1234, '1234abcd', 1000, true, true).subscribe(res => {
            expect(res).toEqual(response);
        });
        const mockReq = httpMock.expectOne(`${API_URL}/admin/v3/transaction/refund`); 
        expect(mockReq.request.method).toBe('POST');
        expect(mockReq.request.responseType).toBe('json');  
    });

    it('should call updateTx correctly', () => {
        const response = {};

        transactionService.updateTx(12, {}).subscribe(res => {
            expect(res).toEqual(response);
            
        });
        const mockReq = httpMock.expectOne(`${API_URL}/admin/v1/transaction/12`); 
        expect(mockReq.request.method).toBe('PUT');
        expect(mockReq.request.responseType).toBe('json');  
    });

    it('should call get vendor correctly', () => {
        const response = {};

        transactionService.getVendorDataForAddress(12).subscribe(res => {
            expect(res).toEqual(response);
            
        });
        const mockReq = httpMock.expectOne(`/transaction/v1/vendor?address=12`); 
        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('json');  
    });
});