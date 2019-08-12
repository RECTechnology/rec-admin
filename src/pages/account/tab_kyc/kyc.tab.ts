import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TIERS } from './tiers';
import { LoginService } from '../../../services/auth/auth.service';

// tslint:disable-next-line: only-arrow-functions space-before-function-paren
const getPropFromPath = function (obj, path) {
  if (!path.length) { return null; }
  for (let i = 0, path2 = path.split('.'), len = path.length; i < len; i++) {
    console.log(obj, path2, i);
    obj = obj[path[i]];
  }
  return obj;
};

@Component({
  selector: 'kyc-tab',
  styleUrls: ['../../../pages/account/tab_kyc/kyc-tab.css'],
  templateUrl: '../../../pages/account/tab_kyc/kyc-tab.html',
})
export class KycTab {
  public tiers: any[] = TIERS;
  public kycFormOpen = false;
  public kycLevel = 0;
  public currentTier: any = {};
  public kycData: any = {};
  public tierStatus;
  public tierPendingSince;

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public us: UserService,
    public ls: LoginService,
  ) {
    const tier = this.us.userData.group_data.tier;
    this.currentTier = this.tiers[tier];
    this.kycData = this.us.userData.kyc_validations;
    this.tierStatus = this.kycData['tier' + (tier + 1) + '_status'];
    this.tierPendingSince = this.kycData['tier' + (tier + 1) + '_status_request'];
    this.updateTiers();
  }

  public updateTiers() {
    this.tiers = this.tiers.map((tier) => {
      tier.canValidate = true;
      if (tier.requirements.items_props) {
        tier.requirements.filled_props = {};
        // tslint:disable-next-line: forin
        for (const key in tier.requirements.items_props) {
          const isFilled = this.isPropFilled(tier.requirements.items_props[key], key);
          tier.requirements.filled_props[key] = isFilled;
          tier.canValidate = tier.canValidate ? isFilled : false;
        }
      }
      return tier;
    });
  }

  public openTierValidation(tier) {
    this.kycFormOpen = true;
    this.kycLevel = tier;
  }

  public closeKycValidation() {
    this.kycFormOpen = false;
    this.kycLevel = null;
  }

  public isPropFilled(objPath, requirement?) {
    if (objPath) {
      let filled = true;
      for (const p of objPath) {
        const prop = getPropFromPath(this.us.userData, p);
        if (!prop || prop === '') {
          filled = false;
          break;
        }
      }
      return filled;
    }
    return false;
  }
}
