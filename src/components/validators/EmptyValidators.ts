import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class EmptyValidators {
    static noWhiteSpace(control: AbstractControl) : ValidationErrors | null {
        if(control.value){
            if((control.value as string).indexOf(' ') >= 0){
                return {noWhiteSpace: true}
            }
            return null;
        }
       
    }
}/*import { EmptyValidators} from 'src/components/validators/EmptyValidators';
*/