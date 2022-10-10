import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../../services/app/app.service';
import { AppModule } from '../../../app/app.module';
import { EnabledDisabledAccountsTab } from './tab_user_enabled_disabled_accounts';



describe('Users Page tests', () => {

    
    let component: EnabledDisabledAccountsTab;
    let fixture: ComponentFixture<EnabledDisabledAccountsTab>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(EnabledDisabledAccountsTab);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});