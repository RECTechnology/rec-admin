import { NgModule } from '@angular/core';
import { TableListHeader } from './tl-header/tl-header.component';
import { TableListTable } from './tl-table/tl-table.component';
import { TableListSubHeader } from './tl-subheader/tl-subheader.component';
import { SharedModule } from 'src/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/shared/md-module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        TableListHeader,
        TableListSubHeader,
        TableListTable,
    ],
    exports: [
        TableListHeader,
        TableListSubHeader,
        TableListTable,
    ],
    imports: [
        SharedModule,
        TranslateModule.forChild(),
        MaterialModule,
        BrowserModule,
        FormsModule,
    ],
})
export class TableListModule {

}
