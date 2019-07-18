export class Filter {

  public filters = {
    search: '',
    // tslint:disable-next-line: object-literal-sort-keys
    methods_in: [],
    methods_out: [],
    fees: 1,
    swift_in: [],
    swift_out: [],
    pos: [],
    clients: [],
    exchanges: [],
    services: [],
    status: [],
  };
  public filterQuery = 'exchanges:all status:all';
  public statuses = [
    'success',
    'failed',
    'canceled',
    'created',
    'expired',
    'sent',
  ];

  public construct(): any {
    const filters = {};
    // tslint:disable-next-line: forin
    for (const key in this.filters) {
      const filter = this.filters[key];
      const fl = filter.length;
      const isArray = filter instanceof Array;

      if (fl > 0 && isArray) {
        console.log('Is array and more thant one', filter);
        filter.forEach((value) => {
          const keyStr = `query[${key}][]`;
          filters[keyStr] = value;
        });
      } else if (fl <= 0 && isArray) {
        filters[`query[${key}]`] = 'all';
      } else {
        filters[`query[${key}]`] = filter;
      }
    }
    return filters;
  }

  public add(name, value) {
    console.log('ADD: ', name, value);
    if (value === 'Spark/Opex') {
      this.filters[name].push('spark');
      this.addFilterQuery(name, 'spark');

      this.filters[name].push('opex');
      this.addFilterQuery(name, 'opex');
    } else {
      this.filters[name].push(value);
      this.addFilterQuery(name, value);
    }
  }

  public remove(name) {
    const val = this.filters[name];
    delete this.filters[name];
    this.removeFilterQuery(name, val);
  }

  public addFilterQuery(key, value) {
    const fToAppend = `${key}:${value}`;
    if (!this.filterQuery.includes(fToAppend)) {
      this.removeFilterQuery(key, value);
      this.filterQuery += ' ' + fToAppend;
    }
    this.filterQuery = this.filterQuery.replace(/ +/g, ' ');
  }

  public removeFilterQuery(key, value) {
    if (value !== 'all') {
      this.filterQuery = this.filterQuery.replace(new RegExp(`\s?${key}:all`), '');
    } else if (value === 'all') {
      this.filterQuery = this.filterQuery.replace(new RegExp(`\s?${key}:.+`, 'g'), '');
    }
  }
}

export class TxFilter {
  public filterQuery = 'exchanges:all status:all methods_in:all methods_out:all';
  public statuses = ['success', 'failed', 'canceled', 'created', 'expired', 'sent', 'received', 'sending'];
  public filterOptions = {
    all: 'all',
    in_methods: [],
    out_methods: [],
    status: [],
  };
  public filterModified = false;
  public selectedFilter = { title: 'All', name: 'all' };
  public selectedFilterOptions: any[] = [];
  public search = '';
  public FILTER_NONE = { name: 'none' };
  public FILTER_ALL = { name: 'all' };
  public filtertypes = [
    { title: 'Cash In', name: 'methods_in', transformer: (el) => el ? el.toLowerCase() : el },
    { title: 'Cash Out', name: 'methods_out', transformer: (el) => el ? el.toLowerCase() : el },
    { title: 'Status', name: 'status' },
    { title: 'All', name: 'all' },
  ];
  public lastOptionSelected: string = '';
  public filterArray = [];
  public path = '/transactions';

  public router: any;
  constructor(router?, path = '/transactions') {
    this.router = router;
    this.path = path;
    this.clearFilter();
  }

  public reloader: any = () => { return; };

  /**
  * @param {Object} filter - One Of { this.filtertypes }
  */
  public selectFilter(filter) {
    this.selectedFilter = filter;
    if (filter.name === 'all') {
      this.clearFilter();
    } else { this.selectedFilterOptions = this.filterOptions[this.selectedFilter.name]; }
    this.lastOptionSelected = ''; // this.selectedFilterOptions[0]
  }

  /**
  * @param {string} key    - name of the filter
  * @param {string} value  - value of the filter
  * @param {Object} filter - the whole fitler object in case needed
  */
  public addFilter(key, value, filter) {
    console.log('Add filter');
    if (value === 'Spark/Opex') {
      this.addFilter(key, 'spark', filter);
      return;
    }
    if (!this.hasFilter(value, filter)) {
      this.filterArray = this.filterArray.filter((x) => {
        if (x.key === key && x.value === 'all') { return false; }
        return true;
      });
      this.filterArray.push({ key, value });
      this.lastOptionSelected = value;
      this.reloader();
      this.filterModified = true;

      if (this.router) {
        this.router.navigate([this.path], {
          queryParams: { [key]: value },
          queryParamsHandling: 'merge',
        });
      }
    } else {
      const i = this.filterArray.indexOf({ key, value });
      console.log('already has filter: ', key, i);
      this.filterArray.splice(i, 1);
    }
  }

  public clearFilter() {
    console.log('clearfilter');
    this.filterArray = [
      { key: 'exchanges', value: 'all' },
      { key: 'status', value: 'all' },
      { key: 'methods_in', value: 'all' },
      { key: 'methods_out', value: 'all' },
    ];
    this.reloader();

    if (this.router) {
      this.router.navigate([this.path], {
        queryParams: {},
        queryParamsHandling: 'merge',
      });
    }

    this.filterModified = false;
  }

  public getFilters() {
    const filtersMap = {};
    this.filterArray.forEach((f) => {
      // tslint:disable-next-line: prefer-const
      let { key, value } = f;
      if (value === 'none') { delete filtersMap[key]; } else if (key === 'exchanges' && value !== 'all') {
        const exchanges = this.filterOptions[key];
        const savedVal = value;
        for (const ex of exchanges) {
          if (ex !== savedVal) {
            value = `exchange_${savedVal}to${ex}`;
            if (filtersMap[key] && filtersMap[key].indexOf(value) === -1) {
              filtersMap[key].push(value);
            } else {
              filtersMap[key] = [value];
            }
          }
        }
      } else {
        filtersMap[key]
          ? filtersMap[key].push(value)
          : filtersMap[key] = [value];
      }
    });
    return filtersMap;
  }

  public hasFilter(opt, filter) {
    return this.filterArray.some((_) => _.key === filter.name && _.value === opt);
  }

  public getFilterData(offset, limit, from?, to?) {
    const filters: any = this.getFilters();
    const filterData = [
      { key: 'query[start_date]', value: from },
      { key: 'query[finish_date]', value: to },
      { key: 'offset', value: offset },
      { key: 'limit', value: limit },
      { key: 'query[search]', value: this.search },
      { key: 'query[fees]', value: 1 },
      { key: 'query[swift_in]', value: 'all' },
      { key: 'query[swift_out]', value: 'all' },
    ].filter((_) => _);

    if (filters) {
      for (const key in filters) {
        if (key === 'search') {
          filterData.push({ key: 'query[search]', value: filters[key] });
        } else {
          filters[key].forEach((f) => {
            if (f !== 'none') {
              const nkey = f === 'all' ? 'query[' + key + ']' : 'query[' + key + '][]';
              filterData.push({ key: nkey, value: f });
            }
          });
        }
      }
    }

    let hasOutMethods = null;
    let hasInMethods = null;
    let hasExchanges = null;
    filterData.forEach((el) => {
      hasOutMethods = hasOutMethods != null ? el.key === 'query[methods_out][]' : false;
      hasInMethods = hasInMethods != null ? el.key === 'query[methods_in][]' : false;
      hasExchanges = hasExchanges != null ? el.key === 'query[exchanges][]' : false;
    });

    return filterData.filter((f) => {
      if (f.key === 'query[methods_out]') {
        if (hasInMethods || hasExchanges) { return false; }
      }
      if (f.key === 'query[methods_in]') {
        if (hasOutMethods || hasExchanges) { return false; }
      }
      if (f.key === 'query[exchanges]') {
        if (hasOutMethods || hasInMethods) { return false; }
      }
      return true;
    });
  }
}
