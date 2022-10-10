import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../services/app/app.service';
import { AppModule } from '../../app/app.module';
import { UserComponent } from '../user/user.component';
import { UsersPage } from './users.component';



describe('Users Page tests', () => {

    
    let component: UsersPage;
    let fixture: ComponentFixture<UsersPage>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UsersPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});