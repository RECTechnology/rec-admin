import { Component, AfterContentInit, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import { Brand } from '../../../../environment/brand';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';

@Component({
  selector: 'csv-upload',
  templateUrl: './csv-upload.html',
})

export class CsvUpload {
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
    public dialogRef: MatDialogRef<CsvUpload>,
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
    } else {
      this.hasSelectedImage = false;
    }
  }

  public uploadFile() {
    this.us.uploadFileWithProgress(this.file)
      .subscribe(
        (resp) => {
          this.close(resp.data.src);
        },
        (error) => {
          this.snackBar.open('Error uploading: ' + error.message, 'ok');
          this.error = error.message;
        },
      );
  }

  public close(confirmed): void {
    this.dialogRef.close(confirmed);
  }
}
