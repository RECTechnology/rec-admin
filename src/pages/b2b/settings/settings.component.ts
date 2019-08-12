import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { EditItemDia } from './edit-item/edit-item.dia';
import { B2bService } from 'src/services/b2b/b2b.service';
import { Observable } from 'rxjs/internal/Observable';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AddItemDia } from './add-item/add-item.dia';

@Component({
    selector: 'b2b-settings',
    templateUrl: './settings.html',
})
export class B2BSettingsComponent {
    public tab: string = '';
    public currentTab = 0;
    public tabMap = {
        neighborhoods: 0,
        // tslint:disable-next-line: object-literal-sort-keys
        activities: 1,
        products: 2,
        0: 'neighborhoods',
        1: 'activities',
        2: 'products',
    };

    public neighborhoods = [
        { id: 1, esp: 'Gracia', cat: 'Gracia', eng: 'Gracia' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample' },
    ];

    public products = [
        { id: 1, esp: 'Pan', cat: 'Pa', eng: 'Bread' },
        { id: 2, esp: 'Agua', cat: 'Aigua', eng: 'Water' },
    ];

    public activities = [
        // { id: 1, esp: 'Panaderia', cat: 'Panaderia', eng: 'Bakery' },
        // { id: 2, esp: 'Bar', cat: 'Bar', eng: 'Pub' },
    ];

    constructor(
        public controles: ControlesService,
        public route: ActivatedRoute,
        public router: Router,
        public dialog: MatDialog,
        public b2b: B2bService,
        public snackbar: MySnackBarSevice,
    ) {
        this.route.queryParams
            .subscribe((params) => {
                this.tab = params.tab || 'neighborhoods';
                this.currentTab = this.tabMap[this.tab] || 0;
            });
    }

    public editItem(type, data, callback: (id: any, data: any) => Observable<any>) {
        const dialogRef = this.dialog.open(EditItemDia);
        dialogRef.componentInstance.itemType = type;
        dialogRef.componentInstance.item = { ...data };

        return dialogRef.afterClosed()
            .subscribe((edited) => {
                if (edited) {
                    callback.call(this.b2b, data.id, edited)
                        .subscribe((resp) => {
                            this.snackbar.open('EDITED_CORRECTLY', 'ok');
                        }, (error) => {
                            this.snackbar.open(error.message, 'ok');
                        });
                }
            });
    }

    public addItem(type: string, callback: (id: any, data: any) => Observable<any>) {
        const dialogRef = this.dialog.open(AddItemDia);
        dialogRef.componentInstance.itemType = type.toUpperCase();

        return dialogRef.afterClosed()
            .subscribe((data) => {
                if (data) {
                    callback.call(this.b2b, data)
                        .subscribe((resp) => {
                            this.snackbar.open('ADDED_CORRECTLY', 'ok');
                        }, (error) => {
                            this.snackbar.open(error.message, 'ok');
                        });
                }
            });
    }

    public editNeighborhood($event) {
        return this.editItem('neighborhood', $event, this.b2b.editNeighborhood);
    }

    public editProducts($event) {
        return this.editItem('products', $event, this.b2b.editProducts);
    }

    public editActivities($event) {
        return this.editItem('activities', $event, this.b2b.editActivities);
    }

    public addNeighborhood() {
        return this.addItem('neighborhood', this.b2b.addNeighborhood);
    }

    public addProduct() {
        return this.addItem('products', this.b2b.addProducts);
    }

    public addActivity() {
        return this.addItem('activities', this.b2b.addActivities);
    }

    public deleteProduct($event) { }

    public deleteActivity($event) { }

    public deleteNeighborhood($event) { }

    /* Called when tab change, so url changes also */
    public changeUrl($event) {
        this.router.navigate(['/b2b/settings'], {
            queryParams: { tab: this.tabMap[$event] },
            queryParamsHandling: 'merge',
        });
    }
}
