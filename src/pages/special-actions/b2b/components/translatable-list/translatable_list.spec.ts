import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../../../../services/app/app.service';
import { AppModule } from '../../../../../app/app.module';
import { TranslatableListComponent } from './translatable-list.component';



describe('Users Page tests', () => {

    
    let component: TranslatableListComponent;
    let fixture: ComponentFixture<TranslatableListComponent>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TranslatableListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});