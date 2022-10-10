import { HttpClient, HttpEvent } from "@angular/common/http";
import { LoginService } from "../auth/auth.service";
import { UserService } from "../user.service";
import { AdminService } from "./admin.service";
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { inject, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppModule } from '../../app/app.module';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let injector: TestBed;
let adminService: AdminService;
let userService: UserService;
let ls: LoginService;
let ns: NotificationService;
let cs: CompanyService;
let httpMock: HttpTestingController;

describe('AdminService', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ['get', 'post', 'put', 'delete']);
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule ],
            providers: [UserService, AdminService, LoginService, NotificationService, CompanyService]
        })
        injector = getTestBed();
        userService = testModule.inject<UserService>(UserService);
        adminService = new AdminService(httpClientSpy, userService, ls, ns, cs);
        adminService = injector.inject(AdminService);
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
        expect(adminService).toBeTruthy();
    });

    it('Should return expected payment orders(HttpClient called once)', () => {

            const expectedPaymentOrders = 
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

               
    
             adminService.listPaymentOrders(12, {}).subscribe((res) => {
                expect(res).toEqual(expectedPaymentOrders);
             });

             const mockReq = httpMock.expectOne(`/admin/v3/payment_orders?pos_id=12`); 

            expect(mockReq.request.method).toBe('GET');
            expect(mockReq.request.responseType).toBe('json');  

    });
});
  



