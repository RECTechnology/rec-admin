import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from 'src/app/app.module';
import { ConvertToLangPipe } from './convert-to-lang.pipe';
import { UserService } from '../../services/user.service';
import { TestBed, getTestBed } from '@angular/core/testing';
describe('Convert-to-lang-pipe', () => {
    let langPipe: ConvertToLangPipe;
    let us: UserService;
    let injector: TestBed;

    beforeEach(() =>{
        let testModule = TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule ],
            providers: [UserService]
        })
        injector = getTestBed();
        us = testModule.inject<UserService>(UserService);
        langPipe = new ConvertToLangPipe(us);
    });

    it('converts to lang correctly', () => {
        let accounts= {
            name: 'Accounts',
            name_es: 'Cuentas',
            name_ca: 'Comptes'
        }
        expect(langPipe.transform(accounts)).toBe('Cuentas')
    });
});