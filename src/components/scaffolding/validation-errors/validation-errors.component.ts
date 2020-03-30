import { Component, OnInit, Input } from '@angular/core';

interface ValidationError {
    message: string;
    property_path: string;
}

@Component({
    selector: 'validation-errors',
    styles: [`:host { display: block; }`],
    templateUrl: './validation-errors.html',
})
export class ValidationErrorsComponent implements OnInit {
    @Input('errors') public validationErrors: ValidationError[] = [];
    @Input('hidden') public hidden: boolean = false;
    @Input('validationName') public validationName: string = '';

    public ngOnInit() {
        this.hidden = this.validationErrors.length <= 0;
    }

    public hideErrors() {
        this.hidden = true;
    }

    public closeErrors() {
        this.validationErrors = [];
    }

    public showErrors() {
        this.hidden = false;
    }
}
