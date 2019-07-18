import { Injectable } from '@angular/core';

@Injectable()
export class ControlesService {
  public sidemenuVisible: boolean = true;
  public profileDropDownActive: boolean = false;
  public devDropdownExpanded: boolean = false;
  public chatVisible: boolean = false;
  public resellerExpanded: boolean = false;
  public errorReporterOpened: boolean = false;

  public showAccountDetails: boolean = false;

  public currencySelected = false;
  public selectedCurrency: any = {};

  public showMovements = false;
  public showUsers = false;

  public toggleChat(state?: boolean): void {
    if (state != null && state !== undefined) {
      this.chatVisible = state;
    } else {
      this.chatVisible = !this.chatVisible;
    }
  }

  public toggleReseller(state?: boolean): void {
    if (state != null && state !== undefined) {
      this.resellerExpanded = state;
    } else {
      this.resellerExpanded = !this.resellerExpanded;
    }
  }

  public selectCurrency(amount, currency) {
    this.selectedCurrency = {
      ...currency,
      amount,
    };
    this.currencySelected = true;
  }

  public deselectCurrency() {
    this.currencySelected = false;
  }

  /**
  * @param {boolean} state #optional - If its open or closed
  * Toggle sidemenuVisible or set to state if passed
  */
  public toggleSidemenu(state?: boolean): void {
    if (state != null && state !== undefined) {
      this.sidemenuVisible = state;
    } else {
      this.sidemenuVisible = !this.sidemenuVisible;
    }
  }

  /**
  * @param {boolean} state #optional - If its open or closed
  * Toggle profileDropDownActive or set to state if passed
  */
  public toggleProfileDropDown(state?: boolean): void {
    if (state != null && state !== undefined) {
      this.profileDropDownActive = state;
    } else {
      this.profileDropDownActive = !this.profileDropDownActive;
    }
  }

  /**
  * @param {boolean} state #optional - If its open or closed
  * Toggle devDropdownExpanded or set to state if passed
  */
  public toggledevDropdown(state?: boolean): void {
    if (state != null && state !== undefined) {
      this.devDropdownExpanded = state;
    } else {
      this.devDropdownExpanded = !this.devDropdownExpanded;
    }
  }
}
