export class PrepaidCard {
  public static STATUS_NOT_ORDERED = 'not_ordered';
  public static STATUS_PENDING_SEND = 'pending_send';
  public static STATUS_PENDING_RECEIVE = 'pending_receive';
  public static STATUS_PENDING_ACTIVATE = 'pending_activate';
  public static STATUS_ACTIVATED = 'activated';

  public status: string = PrepaidCard.STATUS_NOT_ORDERED;
  public currency: string = '';
  public scale: number = 2;
  public id: string = '';
  public dbID: any = '';
  public date: string = '';
  public canHaveMore: boolean = false;
}

export class PrepaidCardMulti {
  public static STATUS_NOT_ORDERED = 'not_ordered';
  public static STATUS_PENDING_SEND = 'pending_send';
  public static STATUS_PENDING_RECEIVE = 'pending_receive';
  public static STATUS_PENDING_ACTIVATE = 'pending_activate';
  public static STATUS_ACTIVATED = 'activated';

  public cardData: any = {
    address: null,
    alias: null,
    city: null,
    country: null,
    created: null,
    document: null,
    id: null,
    id_card: null,
    name: null,
    status: null,
    surnames: null,
    zip: null,
  };

  get id_card() {
    return this.cardData.id_card;
  }

  public currency: string = 'EUR';
  public scale: number = 2;
  public type: string = '';

  constructor(data, type) {
    this.type = type;
    for (const key in data) {
      if (key in this.cardData) {
        this.cardData[key] = data[key];
      }
    }
  }
}
