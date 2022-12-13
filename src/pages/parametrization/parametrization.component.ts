import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { AlertsService } from "src/services/alerts/alerts.service";
import { ConfigurationSettingsCrud } from '../../services/crud/config_settings/configuration_settings';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'ParametrizationComponent',
    templateUrl: './parametrization.html',
    styleUrls: ['./parametrization.scss'],
  })

export class ParametrizationComponent {
    
    public pageName = 'Parametrization';
    public Brand: any = environment.Brand;
    public itemValue: any;
    public loading = false;
    public canUpdate: boolean = false;
    public mockData: any = [];
    public platformFilter: string = '';
    public packageFilter: string = '';
    public nameFilter: string = '';
    public adminPlatform = 'admin_panel';
    public urlLocation = 'parametrization';
    public mockDataCopy: any;
    public platforms: string[] = [];
    public packages: string[] = [];
    public packagesCopy: string[] = [];

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public translateService: TranslateService,
        public crud: ConfigurationSettingsCrud,
        public alertsService: AlertsService,
        public translate: TranslateService,
        public titleService: Title
        ){}

    ngOnInit(){
        this.getConfigSettings();
        const translateTitle = this.translate.instant(this.Brand.title);
        this.setTitle(translateTitle + ' | ' + this.pageName);
    }

    //api methods (get config settings and update settings)
    public getConfigSettings(){
        this.loading = true;
        this.crud.search().subscribe(resp => {
            this.mockData = resp.data.elements;
            this.mockDataCopy = [...this.mockData];
            this.getPlatforms();
            this.getPackages();
            this.loading = false;
        }, (error) => {
            this.loading = false;
        })
    }

    public setTitle(title: string): void {
        this.titleService.setTitle(title);
      }

    public updateSetting(id, itemValue, item){
        var numRegex = /^\d+$/;
        var doubleRegex = /^[+-]?(?:\d*\.)?\d+$/;
        if(item.type === 'int' && !numRegex.test(itemValue)){
            this.alertsService.showSnackbar('ONLY_POSITIVE_INTEGERS');
            return;
        }
        if(item.type === 'double' && !doubleRegex.test(itemValue)){
            this.alertsService.showSnackbar('ONLY_DOUBLE_AND_INTEGERS_WITHOUT_COMMA');
            return;
        }
        this.loading = true;
        this.crud.update(id, {value: itemValue}).subscribe(res => {
            this.crud.search().subscribe(resp => {
                this.mockData = resp.data.elements;
                if(item.platform === this.adminPlatform){
                    this.reloadPage();
                    }
                this.loading = false;
            },error => {
                this.loading = false;
            });
            this.alertsService.showSnackbar('CONFIG_EDITED_CORRECTLY');
        }, (error) => {
            this.loading = false;
            this.alertsService.showSnackbar(error.message);
        })
    }

    //Methods to obtain the data in different arrays and to be able to handle them with the filters
    public getPlatforms(){
        this.mockData.map(item => {
            if(!this.platforms.includes(item.platform)){
                this.platforms.unshift(item.platform);
            }
        })
    }

    public reloadPage(){
        this.router.navigate(['/', this.urlLocation]).then(() =>
            window.location.reload()
        );
    }

    public getItemsForPackage(packageItem){
        return Array.from(this.mockDataCopy.filter(item => {
            return `package_${item.package.name}_name` === packageItem;
        }));
    }

    public getPackages(){
        this.packages = [];
        this.mockDataCopy.map(item => {
            if(item.package && !this.packages.includes(`package_${item.package.name}_name`)){
                this.packages.unshift(`package_${item.package.name}_name`);
            }
        })
        this.mockData.map(item => {
            if(item.package && !this.packagesCopy.includes(`package_${item.package.name}_name`)){
                this.packagesCopy.unshift(`package_${item.package.name}_name`);
            }
        })
        if(!this.packagesCopy.includes('None')){
            this.packagesCopy.unshift('None');
        }
    }

    //Methods to add filters to the different arrays
    public search($event){
        this.nameFilter = $event;
        this.applyFilters(this.platformFilter ,this.packageFilter, this.nameFilter)
        this.getPackages();
    }

    public filterPackages(packageItem){
        this.getPackages();
        this.packages = this.packages.filter(item => {
            return item === packageItem;
        })
    }

    public addPackageFilter($event){
        this.packageFilter = $event;
        if(this.packageFilter !== '' && this.packageFilter !== 'None'){
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    package: this.translateService.instant(this.packageFilter),
                },
                queryParamsHandling: 'merge',
            });
        }else {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    package: null
                },
                queryParamsHandling: 'merge',
            });
        }
        this.applyFilters(this.platformFilter ,this.packageFilter, this.nameFilter);
        this.getPackages();
    }

    public addPlatformFilter(platform){
        this.platformFilter = platform;
        if(this.platformFilter !== ''){
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    platform: this.translateService.instant(`platform_${this.platformFilter}_name`),
                },
                queryParamsHandling: 'merge',
            });

        }else {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    platform: null
                },
                queryParamsHandling: 'merge',
            });
        }
        this.applyFilters(this.platformFilter ,this.packageFilter, this.nameFilter);
        this.getPackages();
    }

    public applyFilters(platform, itemPackage, nameFilter){
        
        this.mockDataCopy = this.mockData.filter( item => {

            if((!itemPackage || itemPackage === 'None') && (!platform || platform === '') && (!nameFilter || nameFilter === '')){
                return this.mockData;
            }
            return (this.packageChecking(item, itemPackage)) && (this.platformChecking(item, platform)) &&
            ((this.nameChecking(item, nameFilter)) || (this.descriptionChecking(item, nameFilter))) 
            ;
        })
        if((itemPackage && itemPackage !== 'None')){
            this.filterPackages(this.packageFilter);
        }
        return this.mockDataCopy;
    }

    //Methods to check the return requirements of the applyFilters function
    public packageChecking(item, packageFilter){
        return (packageFilter !== 'None' && packageFilter.length > 0 ? 
        this.translateService.instant(`package_${item.package.name}_name`).toLowerCase() === this.translateService.instant(packageFilter).toLowerCase() : 
        item)
    }

    public platformChecking(item, platformFilter){
        return platformFilter && platformFilter.length > 0 ? 
        this.translateService.instant(item.platform).toLowerCase() === this.translateService.instant(platformFilter).toLowerCase() : 
        item
    }

    public nameChecking(item, nameFilter){
        return nameFilter && nameFilter.length > 0 ? 
        this.translateService.instant(`config_${item.name}_name`).toLowerCase().includes(this.translateService.instant(nameFilter).toLowerCase()) : 
        item
    }

    public descriptionChecking(item, nameFilter){
        return nameFilter && nameFilter.length > 0 ? 
        this.translateService.instant(`config_${item.name}_description`).toLowerCase().includes(this.translateService.instant(nameFilter).toLowerCase()) : 
        item
    }
}   