import { AppPage } from '../app.po';
import { browser, logging, ElementFinder } from 'protractor';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
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

        // const title = await page.getTitle();
        // console.log('title is: ', title);

        // expect(title).toContain('Dashboard');
    });

    afterEach(async () => {
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
