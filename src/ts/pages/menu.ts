import { Main as m, Main } from './../main';
import { s } from './../data/s';
import { NumPad } from './../numpad'
import {dummyAccounts, Account} from './../data/account';

export class Menu {
    static load() : Promise<object>
    {
        return new Promise(function(resolve, reject){
            console.log("loaded");
            resolve();
        });
    }
}