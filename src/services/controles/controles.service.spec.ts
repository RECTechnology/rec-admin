import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AppModule } from "src/app/app.module";
import { ControlesService } from "./controles.service";

describe('ControlesService', () => {
    afterEach(() => {
        TestBed.resetTestingModule();
      }); beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [AppModule, HttpClientTestingModule],
        });
      });

      it('should be created', () => {
        const controlesService: ControlesService = TestBed.inject(ControlesService);
        expect(controlesService).toBeTruthy();
      });

      it('should toggle correctly', () => {
        const controlesService: ControlesService = TestBed.inject(ControlesService);
        expect(() => {
            controlesService.toggle('sidebar')
        }).not.toThrowError();
        expect(controlesService.toggles['sidebar']).toEqual(true);
      });

      it('Should addHandler correctly', () => {
        const controlesService: ControlesService = TestBed.inject(ControlesService);
        expect(() => {
            controlesService.addHandler('toggle', () => {});
        }).not.toThrowError();
        expect(controlesService.handlers.size).toEqual(1);
      });

      it('Should removeHandler correctly', () => {
        const controlesService: ControlesService = TestBed.inject(ControlesService);
        expect(() => {
            controlesService.removeHandler('toggle', 0);
        }).not.toThrowError();
        expect(controlesService.handlers.size).toEqual(0);
      });

      it('Should return isToggled correctly', () => {
        const controlesService: ControlesService = TestBed.inject(ControlesService);
        expect(() => {
            controlesService.toggle('sidebar')
        }).not.toThrowError();
        expect(controlesService.isToggled('sidebar')).toEqual(true);
      });
});