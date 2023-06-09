import { Component, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.html',
})

export class FileUpload {
  public brand = environment.Brand;
  public error = '';
  public title: string = 'UPLOAD_FILE';
  public canUpload: boolean = false;
  public width: number;
  public heigth: number;
  public selectedImageName: string = 'No file uploaded';
  public hasSelectedImage: boolean = false;
  public noImageName: string = 'profile_default_image';
  public selectedImage;
  public progress = 0;
  public isDefaultButton: boolean = false;

  public extension;
  public isImage = true;
  private file: File;
  private uploadSub: any;
  private zone: NgZone;

  constructor(
    public dialogRef: MatDialogRef<FileUpload>,
    public us: UserService,
    public alerts: AlertsService,
  ) {
    this.us.uploadprogress$.subscribe(
      (data) => {
        this.zone.run(() => {
          this.progress = Math.floor(data);
        });
      });
  }

  public ngOnInit() {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  public changedImage($event) {
    if ($event.target.files.length) {
      const file = $event.target.files[0];
      this.file = file;
      this.selectedImageName = file.name;
      this.hasSelectedImage = true;

      const reader = new FileReader();

      this.isImage = /jpg|jpeg|png|svg/.test(this.selectedImageName);
      this.extension = file.name.split('.').pop();

      reader.onload = (e: any) => {
        const image = new Image();
        this.selectedImage = e.target.result;
        this.canUpload = true;
        image.src = e.target.result;
        image.onload = () => {
          if(this.isImage){
            if((this.width < Number(image.width)) || 
            (this.heigth < Number(image.height))){
              this.canUpload = false;
              this.error = "IMAGE_WIDTH_NOT_VALID";
            }
          }
        }
      } 
      reader.readAsDataURL(file);
    } else {
      this.hasSelectedImage = false;
    }
  }

  public uploadFile() {
    if(this.canUpload){
      this.us.uploadFileWithProgress(this.file)
      .subscribe(
        (resp) => {
          this.close(resp.data.src);
        },
        (error) => {
          this.alerts.showSnackbar('ERROR_UPLOADING ' + error.message, 'ok');
          this.error = error.message;
        },
      );
    }else {
      this.alerts.showSnackbar(this.error);
    }
  }

  public close(confirmed): void {
    this.dialogRef.close(confirmed);
  }
}
