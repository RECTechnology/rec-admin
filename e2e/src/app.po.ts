import { browser, by, element, ElementFinder } from 'protractor';
import { By } from 'selenium-webdriver';

export class AppPage {

  public sleep(seconds) {
    return browser.sleep(seconds * 1000);
  }

  public navigateTo(path = '') {
    return browser.get(browser.baseUrl + path) as Promise<any>;
  }

  public getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  public getTitle() {
    return browser.getTitle() as Promise<any>;
  }

  public getUrl() {
    return browser.getCurrentUrl() as Promise<any>;
  }

  public getElement(elby: By): ElementFinder {
    return element(elby);
  }

  public getElementByCss(selector: string) {
    return this.getElement(by.css(selector));
  }

  public getElementById(id: string) {
    return this.getElement(by.id(id));
  }
}
