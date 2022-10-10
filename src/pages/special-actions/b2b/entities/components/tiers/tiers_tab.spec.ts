import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { TiersTabComponent } from './tiers.tab';



describe('Tiers tab tests', () => {

    
    let component: TiersTabComponent;
    let fixture: ComponentFixture<TiersTabComponent>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TiersTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});