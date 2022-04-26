import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { FileUpload } from 'src/dialogs/other/file-upload/file-upload.dia';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'file-selector',
    styleUrls: ['./file-selector.scss'],
    templateUrl: './file-selector.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileSelector),
            multi: true
        }
    ]
})
export class FileSelector implements OnInit, ControlValueAccessor {
  
    @Input() public label: string = 'Label';
    @Input() public disabled: boolean = false;
    @Input() public changeBtnText: string = 'CHANGE';
    @Input() public file: any;
    @Output() public fileChange = new EventEmitter<any>();
    @Output() public error = new EventEmitter<any>();
    @Input() public isAvatar = true;
    onTouch!: () => void;
    onChange!:(fileChange: EventEmitter<any>) => void;
    isTouched: boolean = false;
   
    writeValue(item: any): void {
        item = this.file;
    }
    registerOnChange(fn: () => void): void {
        this.onChange = fn
    }
    registerOnTouched(fn: () => void): void {
        this.onTouch = fn;
    }

    constructor(
        public alerts: AlertsService,
    ) { }

    public ngOnInit() {
        if(this.isAvatar){
            this.file = this.file || environment.Brand.account_default_image;
        }
    }

    public openUpdateImage() {
        if (this.disabled) { return; }

        return this.alerts.openModal(FileUpload, {
            hasSelectedImage: !!this.file,
            selectedImage: this.file,
        }).subscribe(
            (resp) => {
                if (resp) {
                    this.fileChange.emit(resp);
                    if(!this.isTouched){
                        this.isTouched = true;
                        if(this.onTouch && this.onChange){
                            this.onTouch();
                            this.onChange(this.fileChange)
                        }
                    }
                } else {
                    this.fileChange.emit(this.file);
                }
            },
            (err) => {
                this.error.emit(err);
            });
    }
}
