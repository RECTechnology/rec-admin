import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { AppService } from 'src/services/app/app.service';

@Component({
  selector: 'app-validate-withdrawal',
  templateUrl: './validate-withdrawal.component.html',
  styleUrls: ['./validate-withdrawal.component.scss'],
})
export class ValidateWithdrawalComponent implements OnInit {
  public isLoading = false;
  public error = '';
  public id = '';
  public status = '';
  public validated = false;

  constructor(public route: ActivatedRoute, public app: AppService) {}

  public ngOnInit() {
    const paramsObservable = this.route.params;
    const queryParamsObservable = this.route.queryParams;

    zip(paramsObservable, queryParamsObservable).subscribe(
      ([params, queryParams]) => {
        this.id = params.id;
        this.validateWithdrawal(params.id, queryParams.token);
      },
    );
  }

  public validateWithdrawal(id: string, token: string) {
    this.isLoading = true;
    this.app.validateWithdrawal(id, token).subscribe(
      (resp) => {
        this.status = resp.data.status;
        this.validated = true;
        this.isLoading = false;
      },
      (err) => {
        this.error = err.message;
        this.isLoading = false;
      },
    );
  }
}
