export class dummyAccounts
{  
    private accounts : Account[] = [];

    public loggedInAccount : Account = null;
    public transferToAccount : Account = null;
    
    private static instance : dummyAccounts = null;

    constructor()
    {
        this.accounts.push(new Account(true, "123456", "987654321", true, true, "John Doe", "John", 100.00, 1000.20));
        this.accounts.push(new Account(true, "654321", "987654321", true, true, "John Doe", "John", 100.00, 1000.20));
    }

    //just a dummy function
   getAccountByPin(pin : string) : Account
   {
       return this.accounts.find(a => a.pinCode === pin);
   } 

   getAccountByNumber(accNumber : string) : Account
   {
       return this.accounts.find(a => a.accNumber === accNumber);
   }

   static getInstance() : dummyAccounts
   {
       return (dummyAccounts.instance == null ? dummyAccounts.instance = new dummyAccounts() : dummyAccounts.instance);
   }

   static isLoggedIn() : boolean
   {
       if(dummyAccounts.getInstance().loggedInAccount != null)
        return true;
    
        return false;
   }
}

export class Account 
{
    constructor(public hasCard : boolean,  
                public pinCode : string,
                public accNumber : string,

                public hasSavingsAccount : boolean,
                public hasCurrentAccount : boolean,
            
                public fullName : string,//displayed for transfer and etc
                public displayName : string,
                
                public currentAccountBalance : number,
                public savingAccountBalance : number)
    {

    }
}