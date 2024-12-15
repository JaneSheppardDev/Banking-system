import { BankAccount } from "./bankAccount.js";

let accounts = [];
let notes = document.getElementsByClassName("note");

setTimeout(()=>{
fetch("names.json")
.then(data=>{
    data.json().then(data=>{
        for (let i = 0; i < 4; i++) {
            accounts[i] = new BankAccount(Math.floor(Math.random()*10000),data.names[Math.floor((Math.random()+i)*26)],Math.floor(Math.random()*100000)/100);
            notes[i].children[0].innerText = accounts[i].accountHolder;
            notes[i].classList.remove("loading");
            switch (String(accounts[i].accountNumber).length) {
                case 1:
                    notes[i].children[1].innerText = "000"+accounts[i].accountNumber;
                    break;
                case 2:
                    notes[i].children[1].innerText = "00"+accounts[i].accountNumber;
                    break;
                case 3:
                    notes[i].children[1].innerText = "0"+accounts[i].accountNumber;
                    break;
                default:
                    notes[i].children[1].innerText = accounts[i].accountNumber;
                    break;
            }
        }
    });
});
},1500);
let activeAccount = null;

let screen = document.getElementsByClassName("screen")[0];
let currentScreen = "pin";

let cash = document.getElementsByClassName("cash")[0];
cash.innerText = "Cash: £"+Math.floor(Math.random()*250000)/100;

let title = document.createElement("h2");
title.innerText = "Enter your pin";
title.classList.add("pinTitle");
let pin = document.createElement("input");
pin.classList.add("pinBox");
pin.readOnly = true;
pin.type = "password";

screen.appendChild(title);
screen.appendChild(pin);

let accountName = document.createElement("p");
accountName.classList.add("name");

let accountBalance = document.createElement("p");
accountBalance.classList.add("balance");

let actionContainer = document.createElement("div");
actionContainer.classList.add("action__container");
let deposit = document.createElement("p");
deposit.classList.add("action");
deposit.innerText = "1 - Deposit";
let withdraw = document.createElement("p");
withdraw.classList.add("action");
withdraw.innerText = "2 - Withdraw";
let check = document.createElement("p");
check.classList.add("action");
check.innerText = "3 - Check balance";
actionContainer.appendChild(deposit);
actionContainer.appendChild(withdraw);
actionContainer.appendChild(check);

let numBox = document.createElement("input");
numBox.classList.add("pinBox");
numBox.readOnly = true;
let numBoxValue = "";

let numButtons = document.getElementsByClassName("number");
let enterButton = document.getElementsByClassName("enter")[0];
let cancelButton = document.getElementsByClassName("cancel")[0];

let scrollButton = document.getElementsByClassName("scrollButton")[0];

if(scrollY+innerHeight > notes[0].offsetTop){
    scrollButton.innerText = "keyboard_double_arrow_up";
}
if(scrollY+innerHeight < notes[0].offsetTop+100){
    scrollButton.innerText = "sticky_note_2";
}

addEventListener("scrollend",()=>{
    if(scrollY+innerHeight > notes[0].offsetTop){
        scrollButton.innerText = "keyboard_double_arrow_up";
    }
    if(scrollY+innerHeight < notes[0].offsetTop+100){
        scrollButton.innerText = "sticky_note_2";
    }
});

addEventListener("resize",()=>{
    if(scrollY+innerHeight > notes[0].offsetTop){
        scrollButton.innerText = "keyboard_double_arrow_up";
    }
    if(scrollY+innerHeight < notes[0].offsetTop+100){
        scrollButton.innerText = "sticky_note_2";
    }
});

scrollButton.addEventListener("click",()=>{
    if(scrollButton.innerText == "sticky_note_2"){
        scrollTo({top:notes[0].offsetTop-80,behavior:"smooth"});
    }
    if(scrollButton.innerText == "keyboard_double_arrow_up"){
        scrollTo({top:0,behavior:"smooth"});
    }
});

enterButton.addEventListener("click",()=>{
    if(currentScreen == "pin"){
        checkAccount();
    }
    else if(currentScreen == "account"){
        if(checkAndRemove(deposit,"highlight")){
            ScreenDeposit();
        }
        if(checkAndRemove(withdraw,"highlight")){
            ScreenWithdraw();
        }
        if(checkAndRemove(check,"highlight")){
            ScreenCheck();
        }
    }
    else if(currentScreen == "deposit"){
        
        if(Math.round((Number(cash.innerText.slice(7))-Number(numBox.value))*100)/100 >= 0){
            accounts[activeAccount].deposit(Number(numBox.value));
            cash.innerText = "Cash: £"+Math.round((Number(cash.innerText.slice(7))-Number(numBox.value))*100)/100;
            ScreenAccount();
        }
        else{
            alert("You do not have enough cash for this deposit");
        }
    }
    else if(currentScreen == "withdraw"){
        accounts[activeAccount].withdraw(Number(numBox.value));
        cash.innerText = "Cash: £"+Math.round((Number(cash.innerText.slice(7))+Number(numBox.value))*100)/100;
        ScreenAccount();
    }
    else if(currentScreen == "check"){
        
        ScreenAccount();
    }
});

cancelButton.addEventListener("click",()=>{
    if(currentScreen == "pin"){
        pin.value = "";
        title.innerText = "Enter your pin";
    }
    else if(currentScreen == "account"){
        ScreenPin();
    }
    else if(currentScreen == "deposit" || currentScreen == "withdraw" || currentScreen == "check"){
        ScreenAccount();
    }
});

for (let i = 0; i < numButtons.length; i++) {
    numButtons[i].addEventListener("click",()=>{
        if(currentScreen == "pin"){            
            if(i < 9){
                pin.value += `${i+1}`;
            }
            else{
                pin.value += `${0}`;
            }
        }
        else if(currentScreen == "account"){
            switch (i) {
                case 0:
                    deposit.classList.add("highlight");
                    checkAndRemove(withdraw,"highlight");
                    checkAndRemove(check,"highlight");
                    break;
                case 1:
                    withdraw.classList.add("highlight");
                    checkAndRemove(deposit,"highlight");
                    checkAndRemove(check,"highlight");
                    break;
                case 2:
                    check.classList.add("highlight");
                    checkAndRemove(deposit,"highlight");
                    checkAndRemove(withdraw,"highlight");
                    break;
                default:
                    //do nothing
                    break;
            }
        }
        else if(currentScreen == "deposit" || currentScreen == "withdraw"){
            if(i < 9){
                numBoxValue += `${i+1}`;
                numBox.value = numBoxValue/100;
            }
            else{
                numBoxValue += `${0}`;
                numBox.value = numBoxValue/100;
            }
        }
    });
}


function checkAccount() {
    let existingAccount = false;
    if(pin.value.length == 4){
        for (let i = 0; i < accounts.length; i++) {
            if(pin.value == accounts[i].accountNumber){
                existingAccount = true;
                activeAccount = i;
                ScreenAccount();
                
            }  
            if(!existingAccount){
                title.innerText = "Account does not exist";
            }
        }
    }
    else{
        title.innerText = "Pin must be 4 digits long";
    }
}

function checkAndRemove(element,className) {
    if(element.classList.contains(className)){
        element.classList.remove(className);
        return true;
    }
    return false;
} 

function ScreenPin(){
    currentScreen = "pin";
    screen.innerHTML = "";
    pin.value = "";
    title.innerText = "Enter your pin";
    screen.appendChild(title);
    screen.appendChild(pin);
    checkAndRemove(deposit,"highlight");
    checkAndRemove(withdraw,"highlight");
    checkAndRemove(check,"highlight");
    activeAccount = null;
}

function ScreenAccount() {
    accountName.textContent = "Hello, "+accounts[activeAccount].accountHolder;
    numBox.value = "";
    numBoxValue = "";
    currentScreen = "account";
    screen.innerHTML = "";
    screen.appendChild(accountName);
    screen.appendChild(actionContainer);
}

function ScreenDeposit() {
    currentScreen = "deposit";
    screen.innerHTML = "";
    title.innerText = "Depositing"
    screen.appendChild(title);
    screen.appendChild(numBox);
}

function ScreenWithdraw() {
    currentScreen = "withdraw";
    screen.innerHTML = "";
    title.innerText = "Withdrawing"
    screen.appendChild(title);
    screen.appendChild(numBox);
}

function ScreenCheck() {
    currentScreen = "check";
    screen.innerHTML = "";
    title.innerText = "Checking balance"
    screen.appendChild(title);
    accountBalance.textContent = "£"+accounts[activeAccount].checkBalance();
    screen.appendChild(accountBalance);
}



// TODO: Sound effects/mute button
// TODO: Dark mode

// TODO: Generate buttons in JS