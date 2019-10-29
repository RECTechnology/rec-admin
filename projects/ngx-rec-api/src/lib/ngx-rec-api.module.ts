import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
import { AccountsCrudService } from './services/accounts/accounts.crud';
import { ProductsCrudService } from './services/products/products.crud';
import { ActivitiesCrudService } from './services/activities/activities.crud';
import { NeighborhoodsCrudService } from './services/neighborhoods/neighborhoods.crud';
import { UsersCrudService } from './services/users/users.crud';
import { NgxRecOptions, DEFAULT_OPTS, NgxModuleOptions } from './options';
import { LoggingServiceOptions } from 'projects/ngx-logging/src/lib/services/logging/logging.service';

export const FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<NgxModuleOptions>('forRoot() NgxRecApi configuration.');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    AccountsCrudService,
    ProductsCrudService,
    ActivitiesCrudService,
    NeighborhoodsCrudService,
    UsersCrudService,
    {
      provide: FOR_ROOT_OPTIONS_TOKEN,
      useValue: DEFAULT_OPTS,
    },
    {
      provide: LoggingServiceOptions,
      useFactory: provideMyServiceOptions,
      deps: [FOR_ROOT_OPTIONS_TOKEN],
    },
  ],
})
export class NgxRecApiModule {
  public static forRoot(options?: NgxModuleOptions): ModuleWithProviders {
    return {
      ngModule: NgxRecApiModule,
      providers: [
        AccountsCrudService,
        ProductsCrudService,
        ActivitiesCrudService,
        NeighborhoodsCrudService,
        UsersCrudService,
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useValue: options,
        },
        {
          provide: LoggingServiceOptions,
          useFactory: provideMyServiceOptions,
          deps: [FOR_ROOT_OPTIONS_TOKEN],
        },
      ],
    };
  }
}

export function provideMyServiceOptions(options?: NgxModuleOptions): NgxRecOptions {

  const myServiceOptions = new NgxRecOptions();

  // If the optional options were provided via the .forRoot() static method, then apply
  // them to the MyServiceOptions Type provider.
  if (options && options.base_url) {
    myServiceOptions.base_url = options.base_url;
  }

  if (options && options.lang) {
    myServiceOptions.lang = options.lang;
  }

  return (myServiceOptions);
}
