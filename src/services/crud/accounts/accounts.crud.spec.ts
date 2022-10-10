import { HttpClient, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { AppModule } from "src/app/app.module";
import { CompanyService } from "src/services/company/company.service";
import { UserService } from "src/services/user.service";
import { AccountsCrud } from "./accounts.crud";

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let injector: TestBed;
let httpMock: HttpTestingController;
let userService: UserService;
let companyService: CompanyService;
let accountsCrud: AccountsCrud;

describe('Accounts Crud', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ['get', 'post', 'put', 'delete']);
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule ],
            providers: [UserService, CompanyService]
        })
        injector = getTestBed();
        userService = testModule.inject<UserService>(UserService);
        companyService = testModule.inject<CompanyService>(CompanyService);
        httpMock = injector.inject(HttpTestingController);
        accountsCrud = new AccountsCrud(httpClientSpy, userService, companyService);
        accountsCrud = injector.inject(AccountsCrud);
        
    });

    afterEach(() => {
        httpMock.verify();
        httpClientSpy.get.calls.reset();
        httpClientSpy.post.calls.reset();
        httpClientSpy.put.calls.reset();
        httpClientSpy.delete.calls.reset();
    });

    it('should be created', () => {
        expect(accountsCrud).toBeTruthy();
    });

    it('should getPDF correctly', () =>{
        const response = {};

        accountsCrud.getPdf(135).subscribe(res => {
            expect(res).toBe(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/report_clients_providers'); 

        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('blob');
    });

    it('should getPDFasHTML correctly', () =>{
        const response = {};

        accountsCrud.getPdfAsHtml(135).subscribe(res => {
            expect(res).toBe(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/report_clients_providers'); 

        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('text');
    });

    it('should addConsumedProductToAccount correctly and returne it', () =>{
        const response = {value: 'Hello world!'};

        accountsCrud.addConsumedProductToAccount(135, 12).subscribe(res => {
            expect(res).toBe(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/consuming_products'); 
        expect(mockReq.request.method).toEqual('POST');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should respond with a 404 when addProducedProductToAccount fail', (done: DoneFn) =>{
        const response = {};

        accountsCrud.addProducedProductToAccount(135, 12).subscribe(res => {
            expect(res).toEqual(response);
            done();
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/producing_products'); 
        expect(mockReq.request.method).toEqual('POST');
        mockReq.flush(response);
    });

    it('should relacionOfferWithAccount correctly', (done: DoneFn) =>{
        const response = {1: 'Hola Mundo'};

        accountsCrud.relacionOfferWhitAccount(135, {}).subscribe(res => {
            expect(res).toEqual(response);
            done();
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/offers'); 
        expect(mockReq.request.method).toEqual('POST');
        mockReq.flush(response);
    });

    it('should removeConsumedProductFromAccount correctly', (done: DoneFn) =>{
        const response = {1: 'Hola Mundo'};

        accountsCrud.removeConsumedProductFromAccount(135, 12).subscribe(res => {
            expect(res).toEqual(response);
            done();
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/consuming_products/12'); 
        expect(mockReq.request.method).toEqual('DELETE');
        mockReq.flush(response);
    });

    it('should removeProducedProductFromAccount correctly', (done: DoneFn) =>{
        const response = {1: 'Hola Mundo'};

        accountsCrud.removeProducedProductFromAccount(135, 12).subscribe(res => {
            expect(res).toEqual(response);
            done();
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/producing_products/12'); 
        expect(mockReq.request.method).toEqual('DELETE');
        mockReq.flush(response);
    });

    it('should addActivity correctly', (done: DoneFn) =>{
        const response = {1: 'Hola Mundo'};

        accountsCrud.addActivity(135, 12).subscribe(res => {
            expect(res).toEqual(response);
            done();
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/activities'); 
        expect(mockReq.request.method).toEqual('POST');
        mockReq.flush(response);
    });

    it('should deleteActivity correctly', (done: DoneFn) =>{
        const response = {1: 'Hola Mundo'};

        accountsCrud.deleteActivity(135, 12).subscribe(res => {
            expect(res).toEqual(response);
            done();
        })

        const mockReq = httpMock.expectOne('/admin/v3/accounts/135/activities/12'); 
        expect(mockReq.request.method).toEqual('DELETE');
        mockReq.flush(response);
    });
});