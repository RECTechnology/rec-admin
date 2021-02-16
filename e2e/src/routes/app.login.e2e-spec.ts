import { AppPage } from '../app.po';
import { browser, logging, ElementFinder } from 'protractor';

describe('Rec Admin App', () => {
    let page: AppPage;

    afterEach(() => {
    TestBed.resetTestingModule();
  }); beforeEach(() => {
        page = new AppPage();
    });

    it('should do login correctly', async () => {
        await page.navigateTo('login');

        await page.sleep(3);

        const username: ElementFinder = await page.getElementById('username');
        const password = await page.getElementById('password');
        const btn = await page.getElementById('login-btn');

        await page.sleep(3);

        await username.sendKeys('80008000q');
        await password.sendKeys('qwerty');
        btn.click();

        await page.sleep(5);
    });

    afterEach(async () => {
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
