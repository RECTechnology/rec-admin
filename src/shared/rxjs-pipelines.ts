import { retryWhen } from 'rxjs/internal/operators/retryWhen';
import { concat } from 'rxjs/internal/operators/concat';
import { delay } from 'rxjs/internal/operators/delay';
import { take } from 'rxjs/internal/operators/take';
import { throwError } from 'rxjs';

export const retryPipeline =
    retryWhen((errors) => errors.pipe(delay(5000), take(3), concat(throwError(errors))));
