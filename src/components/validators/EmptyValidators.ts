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
    static noWhitespaceValidator(control: AbstractControl) : ValidationErrors | null {
        if(control.value){
            const isWhitespace = (control.value).trim().length === 0;
            const isValid = !isWhitespace;
            return isValid ? null : { 'whitespace': true };
        }
    }
}/*import { EmptyValidators} from 'src/components/validators/EmptyValidators';
*/