import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../../services/app/app.service';
import { AppModule } from '../../../app/app.module';
import { UserDocumentsTab } from './tab_user_document';



describe('Users Page tests', () => {

    
    let component: UserDocumentsTab;
    let fixture: ComponentFixture<UserDocumentsTab>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UserDocumentsTab);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});