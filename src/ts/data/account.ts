export enum AccountTypes {
    Savings,
    Current
}

export class dummyAccounts {
    private accounts: Account[] = [];

    public loggedInAccountIndex = null;
    public transferToAccount: Account = null;

    private static instance: dummyAccounts = null;

    public static accountSelection = AccountTypes;

    constructor() 
    {
        console.log("created");
        this.accounts.push(new Account(true, "123456", "987654321", true, true, "John Doe", "John", 100.00, 1000.20));
        this.accounts.push(new Account(true, "654321", "123456789", true, true, "Jane Doe", "Jane", 200.00, 2123.20));
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
}

export class Account {
    constructor(public hasCard: boolean,
        public pinCode: string,
        public accNumber: string,

        public hasSavingsAccount: boolean,
        public hasCurrentAccount: boolean,

        public fullName: string,//displayed for transfer and etc
        public displayName: string,

        public currentAccountBalance: number,
        public savingAccountBalance: number) {

    }
}