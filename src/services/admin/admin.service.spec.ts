import { HttpClient } from "@angular/common/http";
import { LoginService } from "../auth/auth.service";
import { UserService } from "../user.service";
import { AdminService } from "./admin.service";
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppModule } from '../../app/app.module';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let adminService: AdminService;
let userService: UserService;
let ls: LoginService;
let ns: NotificationService;
let cs: CompanyService;

describe('AdminService', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ['get', 'post', 'put', 'delete']);
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule ],
            providers: [UserService, AdminService, LoginService, NotificationService, CompanyService]
        })
        userService = testModule.inject<UserService>(UserService);
        adminService = new AdminService(httpClientSpy, userService, ls, ns, cs);
        
    });



    afterEach(() => {
        httpClientSpy.get.calls.reset();
        httpClientSpy.post.calls.reset();
        httpClientSpy.put.calls.reset();
        httpClientSpy.delete.calls.reset();
    });

    it('should be created', () => {
        expect(adminService).toBeTruthy();
    });

    it('Should return expected payment orders(HttpClient called once)', (done: DoneFn) => {

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

         httpClientSpy.get.and.returnValue(of(expectedPaymentOrders));

         adminService.listPaymentOrders(12, {}).subscribe({
            next: paymentOrders => {
                expect(paymentOrders).toEqual(expectedPaymentOrders);
                done();
            },
            error: done.fail
         });
         expect(httpClientSpy.get.calls.count())
        .withContext('one call')
        .toBe(1);
    });
});
  



