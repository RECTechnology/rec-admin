import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { ChangeDelegateComponent } from './change_delegate.component';




describe('Change delegate tests', () => {

    
    let component: ChangeDelegateComponent;
    let fixture: ComponentFixture<ChangeDelegateComponent>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ChangeDelegateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});