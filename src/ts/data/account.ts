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
    getAccountByPin(pin: string) : number 
    {
        return this.accounts.findIndex(a => a.pinCode === pin);
    }

    getAccountByNumber(accNumber: string) : number 
    {
        return this.accounts.findIndex(a => a.accNumber === accNumber);
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
    updateAccount(newAccount: Account) 
    {
        let index = this.accounts.findIndex(a => a.accNumber === newAccount.accNumber);

        this.accounts[index] = newAccount;

        this.save();
        console.log("Updated Accounts", this.accounts);
    }

    addToBalance(account: Account, accSelection: AccountTypes, amount: number) 
    {
        console.log(amount, accSelection, account);
        if (accSelection == AccountTypes.Current)
            account.currentAccountBalance += amount;
        else if (accSelection == AccountTypes.Savings)
            account.savingAccountBalance += amount;

        this.updateAccount(account);
    }

    getAccount(index : number) : Account
    {
        return this.accounts[index];
    }

    getAccountBalance(accSelection : AccountTypes, account? : Account, ) : number
    {
        if(!account)
            account = this.loggedInAccount();
        if(accSelection == AccountTypes.Current)
            return account.currentAccountBalance;
        else
            return account.savingAccountBalance;
    }

    static getInstance(): dummyAccounts 
    {
        return (dummyAccounts.instance == null ? dummyAccounts.instance = new dummyAccounts() : dummyAccounts.instance);
    }

    static isLoggedIn(): boolean 
    {
        if (dummyAccounts.getInstance().loggedInAccount != null)
            return true;

        return false;
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
            this.accounts.push(new Account(true, "123456", "987654321", "John Doe", "John", true, 5890.96, true, 50000.25));
            this.accounts.push(new Account(true, "654321", "123456789", "Jane Doe", "Jane", true, 10000.00, false, 0));
            this.accounts.push(new Account(true, "111111", "111111111", "Baby Doe", "Baby", false, 0, true, 25512.12));
            this.accounts.push(new Account(true, "222222", "222222222", "Johnny Doe", "Johnny", true, 24521.21, true, 84115.08));
            this.save();
        }
    }

    public clear() : void
    {
        localStorage.clear();
        location.reload();
    }
}

export class Account {
    constructor(public hasCard: boolean,
        public pinCode: string,
        public accNumber: string,

        public fullName: string,//displayed for transfer and etc
        public displayName: string,

        public hasSavingsAccount: boolean,
        public savingAccountBalance: number,
        public hasCurrentAccount: boolean,
        public currentAccountBalance: number
        ) {

    }
}