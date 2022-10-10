import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { DocumentKindsTabComponent } from './document-kinds.tab';



describe('Users Page tests', () => {

    
    let component: DocumentKindsTabComponent;
    let fixture: ComponentFixture<DocumentKindsTabComponent>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(DocumentKindsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});