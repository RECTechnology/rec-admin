import { TlHeader } from '../components/scaffolding/table-list/tl-table/tl-table.component';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';

// tslint:disable-next-line: variable-name
export const TlHeaderId: TlHeader = new TlHeader({
    sort: 'id',
    title: 'ID',
    type: 'code',
    accessor: 'id',
});

// tslint:disable-next-line: variable-name
export const TlHeaderActive: TlHeader = new TlHeader({
    sort: 'active',
    title: 'Active',
    type: 'checkbox',
});

// tslint:disable-next-line: variable-name
export const TlHeaderName: TlHeader = new TlHeader({
    sort: 'name',
    title: 'Name',
    accessor: 'name',
});

export const TlHeaderNameB2B: TlHeader = new TlHeader({
    sort: 'name',
    title: 'Account',
    accessor: 'name',
});

//modificar esto cuando el userName de b2b este implementado
export const TlHeaderUserNameB2B: TlHeader = new TlHeader({
    sort: 'rezero_b2b_username',
    title: 'USERNAME',
    accessor: 'rezero_b2b_username',
});
export const TlHeaderCIFB2B: TlHeader = new TlHeader({
    sort: 'cif',
    title: 'CIF',
    accessor: 'cif',
});

//modificar esto cuando el userName de b2b este implementado


// tslint:disable-next-line: variable-name
export const TlHeaderEmail: TlHeader = new TlHeader({
    sort: 'email',
    title: 'Email',
});

// tslint:disable-next-line: variable-name
export const TlHeaderDescription: TlHeader = new TlHeader({
    sort: 'description',
    title: 'Description',
    accessor: 'description',
});

// tslint:disable-next-line: variable-name
export const TlHeaderAvatar: TlHeader = new TlHeader({
    sortable: true,
    title: 'Name',
    type: 'avatar',
    sort: 'name',
    accessor: (el) => el,
});

// tslint:disable-next-line: variable-name
export const TlHeaderAvatarCompany: TlHeader = new TlHeader({
    sort: 'name',
    title: 'Name',
    type: 'avatar',
    accessor: (el) => el,
});

// tslint:disable-next-line: variable-name
export const TlHeaderCreated: TlHeader = new TlHeader({
    sort: 'created',
    title: 'Created',
    type: 'date',
});

// tslint:disable-next-line: variable-name
export const TlHeaderUpdated: TlHeader = new TlHeader({
    sort: 'updated',
    title: 'Updated',
    type: 'date',
});

// tslint:disable-next-line: variable-name
export const TlHeaderDocumentKind: TlHeader = new TlHeader({
    sort: 'kind',
    title: 'Kind',
    type: 'code',
    accessor(el) {
        return el.kind ? el.kind.name + ' (' + el.kind.id + ')' : 'None';
    },
});

// tslint:disable-next-line: variable-name
export const TlHeaderLwBalance: TlHeader = new TlHeader({
    sort: 'lw_balance',
    accessor: 'lw_balance',
    title: 'LW Balance',
    type: 'number',
    suffix: '€',
});

// tslint:disable-next-line: variable-name
export const TlHeaderAccountType: TlHeader = new TlHeader({
    sort: 'type',
    statusClass: (el: any) => ({
        'col-blue': el !== 'COMPANY',
        'col-orange': el === 'COMPANY',
    }),
    title: 'Type',
    type: 'status',
});

// tslint:disable-next-line: variable-name
export const TlHeaderAccountAmountREC: TlHeader = new TlHeader({
    accessor: (account: Account) => account.getBalance('REC'),
    sortable: false,
    title: 'Amount',
    type: 'number',
    suffix: 'Ɍ',
});

// tslint:disable-next-line: variable-name
export const TlHeaderPhone: TlHeader = new TlHeader({
    accessor: (el) => {
        const hasPlus = String(el.prefix).includes('+');
        return (!hasPlus ? '+' : '') + (el.prefix || '--') + ' ' + (el.phone || 'not-set');
    },
    sort: 'phone',
    title: 'Phone',
});

// tslint:disable-next-line: variable-name
export const TlHeaderCompaniesTotal: TlHeader = new TlHeader({
    accessor: (el) => el.accounts ? el.accounts.length : 0,
    sort: 'companies',
    sortable: false,
    title: 'Companies',
    type: 'number',
});

// tslint:disable-next-line: variable-name
export const TlHeaderOfferCount: TlHeader = new TlHeader({
    accessor: 'offer_count',
    image: {
        accessor: () => '/assets/resources/offerta-small.png',
        sort: 'offer',
        title: 'offer',
    },
    sort: 'offer_count',
    sortable: false,
    title: 'Offers',
    type: 'image',
});

// tslint:disable-next-line: variable-name
export const TlHeaderStatus: TlHeader = new TlHeader({
    sort: 'status',
    title: 'Status',
    type: 'status',
});



// tslint:disable-next-line: variable-name
export const TlHeaderStatusCustom = (statusClass: (any) => any): TlHeader => new TlHeader({
    sort: 'status',
    title: 'Status',
    type: 'status',
    statusClass,
});

// tslint:disable-next-line: variable-name
export const TlHeaderLength = (itemName: string): TlHeader => new TlHeader({
    accessor: (item) => {
        if (item.map) {
            return item[itemName.toLowerCase()].length;
        } else {
            return Object.keys(item[itemName.toLowerCase()]).length;
        }
    },
    sortable: false,
    title: UtilsService.capitalize(itemName),
    type: 'number',
});

// tslint:disable-next-line: variable-name
export const TlHeaderOnClickMap = (action): TlHeader => new TlHeader({
    buttonAction: action,
    buttonImg: '/assets/resources/marcador.png',
    sort: 'coordenates',
    sortable: false,
    title: 'Coordenates',
    type: 'button',
});

// tslint:disable-next-line: variable-name
export const TlHeaderGenerate = (name, data?: Partial<TlHeader>) => {
    return new TlHeader({
        sort: name,
        title: UtilsService.capitalize(name),
        ...(data || {}),
    });
};

// tslint:disable-next-line: variable-name
export const TlHeaders = {
    Active: TlHeaderActive,
    Name: TlHeaderName,
    NameB2B:TlHeaderNameB2B,
    UserNameB2B:TlHeaderUserNameB2B,
    CIFB2B:TlHeaderCIFB2B,
    Id: TlHeaderId,
    Description: TlHeaderDescription,
    Status: TlHeaderStatus,
    StatusCustom: TlHeaderStatusCustom,
    DocumentKind: TlHeaderDocumentKind,
    Avatar: TlHeaderAvatar,
    AvatarCompany: TlHeaderAvatarCompany,
    Email: TlHeaderEmail,
    LwBalance: TlHeaderLwBalance,
    AccountType: TlHeaderAccountType,
    AccountAmountREC: TlHeaderAccountAmountREC,
    Phone: TlHeaderPhone,
    CompaniesTotal: TlHeaderCompaniesTotal,
    OfferCount: TlHeaderOfferCount,
    Created: TlHeaderCreated,
    Updated: TlHeaderUpdated,

    onMap: TlHeaderOnClickMap,
    length: TlHeaderLength,
    generate: TlHeaderGenerate,
};