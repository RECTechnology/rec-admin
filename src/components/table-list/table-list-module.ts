import { NgModule } from '@angular/core';
import { TableListHeader } from './tl-header/tl-header.component';
import { TableListTable } from './tl-table/tl-table.component';
import { TableListSubHeader } from './tl-subheader/tl-subheader.component';

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
})
export class TableListModule {

}
