import { HttpClient } from "@angular/common/http";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from "src/app/app.module";
import { BaseService2 } from './base.service-v2';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let baseService2: BaseService2;
let userService: UserService;

describe('BaseServiceV2', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ['get', 'post', 'put', 'delete', 'patch']);
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [UserService],
        });

        userService = testModule.inject<UserService>(UserService);
        baseService2 = new BaseService2(httpClientSpy, userService);
    });


    afterEach(() => {
        httpClientSpy.get.calls.reset();
        httpClientSpy.post.calls.reset();
        httpClientSpy.put.calls.reset();
        httpClientSpy.delete.calls.reset();
    });


    it('should be created', () => {
        expect(baseService2).toBeTruthy();
    });

    it('setFlags true called correctly', () => {
        baseService2.setFlag('translateHeaders', true);
        expect(baseService2.opts.flags.translateHeaders).toEqual(true);
    });
    it('setFlags false called correctly', () => {
        baseService2.setFlag('translateHeaders', false);
        expect(baseService2.opts.flags.translateHeaders).toEqual(false);
    });

    it('getFlags true called correctly', () => {
        baseService2.setFlag('translateHeaders', true);
        expect(baseService2.getFlag('translateHeaders')).toBe(true);
    });

    it('getFlags false called correctly', () => {
        baseService2.setFlag('translateHeaders', false);
        expect(baseService2.getFlag('translateHeaders')).toBe(false);
    });

    it('getUrl called correctly', () => {
        baseService2.opts.base_url = 'https://rec.barcelona';
        expect(baseService2.getUrl('/localhost')).toBe('https://rec.barcelona/localhost');
    });

    it('getToken called correctly', () => {
        expect(baseService2.getToken()).toBe(userService.tokens.access_token);
    });

    it('get called correctly', (done: DoneFn) => {

        httpClientSpy.get.and.returnValue(of({}));

        baseService2.get('https://rec.barcelona').subscribe({
            next: res => {
                expect(res).toEqual({});
                done();
            },
            error: done.fail
            })
            expect(httpClientSpy.get.calls.count())
            .withContext('one call')
            .toBe(1);
        });

    it('delete called correctly', (done: DoneFn) => {

        httpClientSpy.delete.and.returnValue(of({}));
    
        baseService2.delete('https://rec.barcelona').subscribe({
            next: res => {
                expect(res).toEqual({});
                done();
            },
            error: done.fail
            })
            expect(httpClientSpy.delete.calls.count())
            .withContext('one call')
            .toBe(1);
        });

    it('post called correctly', (done: DoneFn) => {
        httpClientSpy.post.and.returnValue(of({}));
    
        baseService2.post('https://rec.barcelona', {}).subscribe({
            next: res => {
                expect(res).toEqual({});
                done();
            },
            error: done.fail
            })
            expect(httpClientSpy.post.calls.count())
            .withContext('one call')
            .toBe(1);
        }); 
        
    it('patch called correctly', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(of({}));
    
        baseService2.patch('https://rec.barcelona', {}).subscribe({
            next: res => {
                expect(res).toEqual({});
                done();
            },
            error: done.fail
            })
            expect(httpClientSpy.patch.calls.count())
            .withContext('one call')
            .toBe(1);
        }); 

    it('put called correctly', (done: DoneFn) => {
        httpClientSpy.put.and.returnValue(of({}));
    
        baseService2.put('https://rec.barcelona', {}).subscribe({
            next: res => {
                expect(res).toEqual({});
                done();
            },
            error: done.fail
            })
            expect(httpClientSpy.put.calls.count())
            .withContext('one call')
            .toBe(1);
        });

    it('extract data called correctly', () =>{
        expect(baseService2.extractData({})).toEqual({});
    });

    it('handle error called correctly', () =>{
        expect(baseService2.handleError({'error': 'error'})).toBeTruthy();
    });    
});
