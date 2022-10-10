import { HttpClient, HttpEvent, HttpResponse } from "@angular/common/http";
import { LoginService } from "../auth/auth.service";
import { UserService } from "../user.service";
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { inject, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppModule } from '../../app/app.module';
import { CrudBaseService } from './crud.base';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let injector: TestBed;
let crudBaseService: CrudBaseService<1>;
let userService: UserService;
let httpMock: HttpTestingController;

describe('Crud Base', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ['get', 'post', 'put', 'delete']);
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule ],
            providers: [UserService, CrudBaseService]
        })
        injector = getTestBed();
        userService = testModule.inject<UserService>(UserService);
        crudBaseService = new CrudBaseService(httpClientSpy, userService);
        crudBaseService = injector.inject(CrudBaseService);
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
        expect(crudBaseService).toBeTruthy();
    });

    it('should map correctly', () => {
        expect(crudBaseService.mapper('data')).toEqual('data')
    });

    it('should create correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.create(1, 'es').subscribe(res => {
            expect(res).toBe(response);
        })


        const mockReq = httpMock.expectOne('/admin/v3'); 

        expect(mockReq.request.method).toBe('POST');
        expect(mockReq.request.responseType).toBe('json');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        expect(mockReq.request.body).toEqual(1);
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should remove correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.remove(12).subscribe(res => {
            expect(res).toBe(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/12'); 

        expect(mockReq.request.method).toBe('DELETE');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should update correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.update(12, {}, 'es').subscribe(res => {
            expect(res).toEqual(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/12'); 

        expect(mockReq.request.method).toBe('PUT');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should list correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.list({search: 'data'}, 'es').subscribe(res => {
            expect(res).toEqual(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3?search=data'); 

        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('json');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should search correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.search({search: 'data'}, 'es').subscribe(res => {
            expect(res).toEqual(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/search?search=data'); 

        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('json');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should find correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.find(12, 'es').subscribe(res => {
            expect(res).toEqual(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/12'); 

        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('json');

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: response });
        mockReq.event(expectedResponse);
        mockReq.flush(response);
    });

    it('should export correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.export({}).subscribe(res => {
            expect(res).toEqual(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/export'); 

        expect(mockReq.request.method).toBe('GET');
        expect(mockReq.request.responseType).toBe('text');
    });

    it('should import correctly', () =>{
        const response = {data: 'data'};

        crudBaseService.import({csv: 'string'}).subscribe(res => {
            expect(res).toEqual(response);
        })

        const mockReq = httpMock.expectOne('/admin/v3/import'); 

        expect(mockReq.request.method).toBe('POST');
        expect(mockReq.request.responseType).toBe('json');
    });
});