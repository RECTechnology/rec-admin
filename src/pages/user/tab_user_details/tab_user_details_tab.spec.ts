import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../../services/app/app.service';
import { AppModule } from '../../../app/app.module';
import { UserDetailsTab } from './user_details.tab';



describe('Users Page tests', () => {

    
    let component: UserDetailsTab;
    let fixture: ComponentFixture<UserDetailsTab>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UserDetailsTab);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});