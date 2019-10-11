
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';

export class UserStorage {
  public static defaultStorage: any = {};
  public static hasLoadedYet = false;

  public static save(name, data, key) {
    try {
      const string = JSON.stringify(data);
      const cipherString = AES.encrypt(string, key);
      localStorage.setItem('___USR___' + name, cipherString);
      return cipherString;
    } catch (error) {
      return error;
    }
  }

  public static load(name, key) {
    if (!UserStorage.hasLoadedYet) {
      UserStorage.hasLoadedYet = true;
      const string = localStorage.getItem('___USR___' + name);
      if (string) {
        const deciphered = AES.decrypt(string.toString(), key);
        const decipheredStorage = JSON.parse(deciphered.toString(Utf8));
        decipheredStorage.hasStorage = Object.keys(decipheredStorage).length > 0;

        for (const storKey in decipheredStorage) {
          if (storKey) {
            localStorage.setItem(storKey, decipheredStorage[storKey]);
          }
        }

        localStorage.removeItem('___USR___' + name);
        return UserStorage.defaultStorage = decipheredStorage;
      }
    }
    return UserStorage.defaultStorage;
  }
}
