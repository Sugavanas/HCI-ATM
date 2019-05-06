export enum AccountTypes {
    Savings,
    Current
}

export class dummyAccounts {
    private accounts: Account[] = [];

    public loggedInAccountIndex = null;
    public loggedInByCard : boolean = true;

    private static instance: dummyAccounts = null;

    constructor() 
    {
        this.load();
    }

    //just a dummy function
    public getAccountByPin(pin: string) : number 
    {
        return this.accounts.findIndex(a => a.pinCode === pin);
    }

    public getAccountByNumber(accNumber: string) : number 
    {
        return this.accounts.findIndex(a => (a.accNumberSavings === accNumber || a.accNumberCurrent === accNumber));
    }

    public loggedInAccount(setAccountIndex? : number): Account 
    {
        if(setAccountIndex != null)
            this.loggedInAccountIndex = setAccountIndex;

        if (this.loggedInAccountIndex != null)
            return this.accounts[this.loggedInAccountIndex];
        else
            return null;
    }

    public isLoggedIn() : boolean
    {
        return !(this.loggedInAccountIndex == null);
    }

    //A shit way to update, but it works :))
    public updateAccount(newAccount: Account) 
    {
        let index = this.getAccountByPin(newAccount.pinCode);

        this.accounts[index] = newAccount;

        this.save();
        console.log("Updated Accounts", this.accounts);
    }

    public addToBalance(account: Account, accSelection: AccountTypes, amount: number) 
    {
        console.log(amount, accSelection, account);
        if (accSelection == AccountTypes.Current)
            account.currentAccountBalance += amount;
        else if (accSelection == AccountTypes.Savings)
            account.savingAccountBalance += amount;

        this.updateAccount(account);
    }

    public getAccount(index : number) : Account
    {
        return this.accounts[index];
    }

    public getAccountBalance(accSelection : AccountTypes, account? : Account, ) : number
    {
        if(!account)
            account = this.loggedInAccount();
        if(accSelection == AccountTypes.Current)
            return account.currentAccountBalance;
        else
            return account.savingAccountBalance;
    }

    public getAccountNumberByType(a : Account, accSelection : AccountTypes) : string
    {
        if(accSelection = AccountTypes.Current)
            return a.accNumberCurrent;
        else
            return a.accNumberSavings;
    }

    public getTypeByAccountNumber(accountNumber : string) : AccountTypes
    {
        let account : Account = this.accounts[this.getAccountByNumber(accountNumber)];

        if(account.accNumberSavings === accountNumber)
            return AccountTypes.Savings;
        else
            return AccountTypes.Current;
    }

    private save() : void
    {
        localStorage.setItem("accounts", JSON.stringify(this.accounts));
    }

    private load() : void
    {
        if(localStorage.getItem("accounts") !== null)
            this.accounts = JSON.parse(localStorage.getItem("accounts"));
        else
        {
            console.log("created");
            this.accounts.push(new Account(true, "123456", "John Doe", "John", true, "123456789", 5890.96, true, "123456788", 50000.25));
            this.accounts.push(new Account(true, "654321",  "Jane Doe", "Jane", true, "987654321", 10000.00, false, "", 0));
            this.accounts.push(new Account(true, "111111", "Baby Doe", "Baby", false, "", 0, true, "111111111", 25512.12));
            this.accounts.push(new Account(true, "222222", "Johnny Doe", "Johnny", true, "222222222", 24521.21, true, "222222223", 84115.08));
            this.save();
        }
    }

    public clear() : void
    {
        localStorage.clear();
        location.reload();
    }

    static i(): dummyAccounts 
    {
        return (dummyAccounts.instance == null ? dummyAccounts.instance = new dummyAccounts() : dummyAccounts.instance);
    }

    static isLoggedIn(): boolean 
    {
        return (dummyAccounts.i().loggedInAccountIndex != null)
    }
}

export class Account {
    constructor(public hasCard: boolean,
        public pinCode: string,

        public fullName: string,//displayed for transfer and etc
        public displayName: string,

        public hasSavingsAccount: boolean,
        public accNumberSavings: string,
        public savingAccountBalance: number,
        public hasCurrentAccount: boolean,
        public accNumberCurrent: string,
        public currentAccountBalance: number
        ) {

    }
}