import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { AppService } from 'src/services/app/app.service';
import { NeighborhoodsTabComponent } from './neighborhoods.tab';



describe('Neighbourhood tab tests', () => {

    
    let component: NeighborhoodsTabComponent;
    let fixture: ComponentFixture<NeighborhoodsTabComponent>;

    afterEach(() =>{
        TestBed.resetTestingModule();
    });
    

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [AppService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NeighborhoodsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});