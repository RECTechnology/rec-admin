export const WALLET_STATUS_MAP = {
    '-1': 'wallet SC',
    '1': 'Account not opened',
    '2': 'registered, KYC incomplete',
    '3': 'registered, rejected KYC',
    '5': 'registered, KYC 1 (status given at registration)',
    '6': 'registered, KYC 2',
    '7': 'registered, KYC 3',
    '8': 'registered, expired KYC',
    '10': 'blocked',
    '12': 'closed',
    '13': 'registered, status is being updated from KYC 2 to KYC 3',
    '14': 'one-time customer',
    '15': 'special wallet for crowdlending',
    '16': 'wallet technique',
};

export const IBAN_STATUS_MAP = {
    1: 'None',
    2: 'Internal',
    3: 'Not used',
    4: 'waiting to be verified by Lemon Way ',
    5: 'activated',
    6: 'rejected by the bank',
    7: 'rejected, no owner ',
    8: 'deactivated',
    9: 'rejected',
};

export const LW_ERROR_MONEY_OUT = {
    0: 'successful',
    3: 'money-out successful',
    4: 'error',
};

export const LW_ERROR_P2P = {
    0: 'pending payment',
    3: 'payment successful and terminated',
    4: 'error',
};

export const LW_DOC_MAP = {
    0: 'proof of ID',
    1: 'proof of address',
    2: 'proof of IBAN',
    3: 'Passport (European Community)',
    4: 'Passport (outside the European Community)',
    5: 'Residence permit',
    7: 'proof of registry commerce number for enterprises only',
    11: 'à 20	other documents',
    21: 'SDD mandate',
};

export const processLwTx = (res) => {
    // F*** lemonway man!
    const parts = res.DATE.split('/');
    const temp = parts[0];
    parts[0] = parts[1];
    parts[1] = temp;

    res.DATE = parts.join('/');

    return res;
};
