import * as Sentry from '@sentry/browser';

// tslint:disable-next-line: no-namespace
export namespace MySentry {
    export function setup(env) {
        if (env.sentry && env.sentry.active) {
            if (!env.production) {
                console.log(`Sentry setting up`, env.sentry);
            }
            Sentry.init({
                dsn: env.sentry.dsn,
                release: env.version,
                environment: env.production ? 'Production' : 'Staging',
            });
            Sentry.configureScope((scope) => {
                scope.setTag('type', 'normal');
            });
        }
    }

    export function addTag(key, val) {
        Sentry.configureScope((scope) => {
            scope.setTag(key, val);
        });
    }

    export function setUser(user) {
        Sentry.configureScope((scope) => {
            scope.setUser({ id: user.id, email: user.email, username: user.username });
        });
    }

    export function createException(name, message, opts: any = {}) {
        const error: any = new Error(message);
        error.name = name || 'UnkownError';
        error.params = opts.params;

        if (opts.tags) {
            for (const tag of opts.tags) {
                MySentry.addTag(tag.key, tag.value);
            }
        }

        Sentry.captureException(error);
    }

    export const sentry = Sentry;
}
