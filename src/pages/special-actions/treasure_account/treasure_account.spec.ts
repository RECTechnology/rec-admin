import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppService } from '../../../services/app/app.service';
import { AppModule } from '../../../app/app.module';
import { TreasureAccount } from './treasure_account.component';


describe('Treasure account tests', () => {

    
    let component: TreasureAccount;
    let fixture: ComponentFixture<TreasureAccount>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TreasureAccount);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});