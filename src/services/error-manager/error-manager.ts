import { Injectable } from '@angular/core';

@Injectable()
export class ErrorManager {

  // Array containing the errors
  private errors: any[] = [];

  /**
   * @return {number} - returns the number of errors
   */
  public getLength(): number {
    return this.errors.length;
  }

  /**
   * @param {Object} error - The error to add
   * @return {number} - returns the number of errors
   */
  public addError(error: any): number {
    if (this.getLength() > 10) {
      this.errors.shift();
    }
    return this.errors.push(error);
  }

  /**
   * @return {any[]} - Array of all errors
   */
  public getErrors(): any[] {
    return this.errors;
  }
}
