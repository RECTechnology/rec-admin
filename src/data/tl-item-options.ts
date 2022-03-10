import { TlItemOption } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';

// tslint:disable-next-line: variable-name
export const TlOptionEdit = (action: (any) => any, additional?: TlItemOption): TlItemOption => new TlItemOption({
    callback: action,
    text: 'Edit',
    icon: 'fa-edit',
    ...(additional || {}),
});

// tslint:disable-next-line: variable-name
export const TlOptionView = (action: (any) => any, additional?: TlItemOption): TlItemOption => new TlItemOption({
    callback: action,
    text: 'View',
    icon: 'fa-eye',
    ...(additional || {}),
});

// tslint:disable-next-line: variable-name
export const TlOptionDelete = (action: (any) => any, additional?: TlItemOption): TlItemOption => new TlItemOption({
    callback: action,
    text: 'Delete',
    icon: 'fa-trash',
    class: 'col-error',
    ...(additional || {}),
});
export const TlOptionRevokePermission = (action: (any) => any, additional?: TlItemOption): TlItemOption => new TlItemOption({
    callback: action,
    text: 'REVOKE_PERMISSION',
    ...(additional || {}),
});
export const TlOptionGrantPermission = (action: (any) => any, additional?: TlItemOption): TlItemOption => new TlItemOption({
    callback: action,
    text: 'GRANT_PERMISSION',

    ...(additional || {}),
});

// tslint:disable-next-line: variable-name
export const TlItemOptions = {
    Edit: TlOptionEdit,
    View: TlOptionView,
    Delete: TlOptionDelete,
    Grant: TlOptionGrantPermission,
    Revoke:TlOptionRevokePermission
};
