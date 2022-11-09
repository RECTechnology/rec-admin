import { environment } from '../environments/environment';
export const Colors = {
    REC: {
        primary: '#0098db',
        txColors: ['#e05206', '#de8657'],
        regColors: ['#0098db', '#de8657'],
        neighColors: ['#0098db', '#9ed7f1', '#e05206', '#f0ab87', '#0555a5'],
    },
    laROSA: {
        primary: '#E61872',
        txColors: ['#E61872', '#6BB900'],
        regColors: ['#E61872', '#6BB900'],
        neighColors: ['#E61872', '#6BB900', '#be1e63', '#4c7415', '#455f20'],
    }
}

export const theme = Colors.hasOwnProperty(environment.Brand.name) ?  Colors[environment.Brand.name] : Colors['REC'];
