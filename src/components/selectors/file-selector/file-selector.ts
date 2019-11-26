import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CountryPickerService } from 'ngx-country-picker';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { FileUpload } from 'src/dialogs/other/file-upload/file-upload.dia';

@Component({
    selector: 'file-selector',
    styleUrls: ['./file-selector.scss'],
    templateUrl: './file-selector.html',
})
export class FileSelector implements OnInit {
    @Input() public label: string = 'Label';
    @Input() public changeBtnText: string = 'CHANGE';
    @Input() public file: any;
    @Output() public fileChange = new EventEmitter<any>();
    @Output() public error = new EventEmitter<any>();

    constructor(
        public alerts: AlertsService,
    ) { }

    public ngOnInit() {
        this.file = this.file || environment.Brand.account_default_image;
    }

    public openUpdateImage() {
        return this.alerts.openModal(FileUpload, {
            hasSelectedImage: !!this.file,
            selectedImage: this.file,
        }).subscribe(
            (resp) => {
                if (resp) {
                    console.log('Selcted', resp);
                    this.fileChange.emit(resp);
                } else {
                    this.fileChange.emit(this.file);
                }
            },
            (err) => {
                this.error.emit(err);
            });
    }
}
