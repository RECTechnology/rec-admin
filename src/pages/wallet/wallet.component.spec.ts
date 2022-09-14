import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletComponent } from "./wallet.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../services/app/app.service';
import { AppModule } from '../../app/app.module';
import { environment } from '../../environments/environment';



describe('WalletComponent tests', () => {

    
    let component: WalletComponent;
    let fixture: ComponentFixture<WalletComponent>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(WalletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});