import { Component, AfterContentInit, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { Brand } from '../../../environment/brand';
import { MySnackBarSevice } from '../../../bases/snackbar-base';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.html',
})

export class FileUpload {
  public brand = Brand;
  public error = '';
  public title: string = '';
  public selectedImageName: string = 'none';
  public hasSelectedImage: boolean = false;
  public noImageName: string = 'profile_default_image';
  public selectedImage;
  public progress = 0;
  private file: File;
  private uploadSub: any;
  private zone: NgZone;

  constructor(
    public dialogRef: MatDialogRef<FileUpload>,
    public snackBar: MySnackBarSevice,
    public us: UserService,
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

      reader.onload = (e: any) => this.selectedImage = e.target.result;
      reader.readAsDataURL(file);
    } else {
      this.hasSelectedImage = false;
    }
  }

  public uploadFile() {
    this.us.uploadFileWithProgress(this.file)
      .subscribe(
        (resp) => {
          console.log('asdasd', resp);
          this.close(resp.data.src);
        },
        (error) => {
          console.log('ererre', error);
          this.snackBar.open('Error uploading: ' + error.message, 'ok');
          this.error = error.message;
        },
      );
  }

  public close(confirmed): void {
    this.dialogRef.close(confirmed);
  }
}
