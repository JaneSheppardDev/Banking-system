export class BankAccount{
    constructor(accountNumber,accountHolder,balance){
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }

    deposit(num){
        this.balance += num;
    }

    withdraw(num){
        this.balance -= num;
    }

    checkBalance(){
        return Math.round(100*this.balance)/100;
    }
}