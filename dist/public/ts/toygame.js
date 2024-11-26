"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ToyBettingGame {
    constructor() {
        this.playerMoney = 0;
        this.oppAceCount = 0;
        this.oppQueenCount = 0;
        this.potSize = 1;
        this.oppBetCount = 0;
        this.oppBetSize = 1;
        this.numRounds = 0;
        this.gameMessage = document.getElementById("game-message");
        this.callButton = document.getElementById("call");
        this.foldButton = document.getElementById("fold");
        this.callButton.addEventListener("click", () => this.playerCall());
        this.foldButton.addEventListener("click", () => this.playerFold());
    }
    playerCall() {
        console.log("call");
    }
    playerFold() {
        this.gameMessage.innerHTML = (`You fold<br>`);
    }
    drawCard() {
        const randomIdx = Math.random() < 0.5 ? 0 : 1;
        const card = ['A', 'Q'][randomIdx];
        if (card === 'A') {
            this.oppAceCount += 1;
        }
        else if (card === 'Q') {
            this.oppQueenCount += 1;
        }
        return card;
    }
    getBet(betAmt, potAmt = 1, autocall = false) {
        console.log(`\nYour opponent bets ${betAmt} into a pot of ${potAmt}, bringing the total pot to ${betAmt + potAmt}.`);
        this.gameMessage.innerHTML += (`<br>Your opponent bets ${betAmt} into a pot of ${potAmt}, bringing the total pot to ${betAmt + potAmt}.`);
        this.oppBetCount += 1;
        let action;
        //    if (!autocall) {
        //      action = prompt('Write c to call or f to fold.');
        //    } else {
        //      action = Math.random() < this.playerCallFreq ? 'c' : 'f';
        //    }
        if (action === 'f') {
            console.log('You fold and forfeit the pot.');
        }
        else if (action === 'c') {
            this.playerCallCount += 1;
            if (this.oppCard === 'Q') {
                this.playerMoney += 2;
                console.log(`You call. Your opponent shows a Q and you win the pot. You now have ${this.playerMoney}.\nSo far you have won ${this.playerMoney / this.numRounds} per hand.\nYour opponent has bet ${this.oppBetCount} out of ${this.numRounds} hands, for an observed frequency of ${this.oppBetCount / this.numRounds}.`);
            }
            else if (this.oppCard = 'A') {
                this.playerMoney -= 1;
                console.log(`You call. Your opponent shows an Ace and you lose the pot. You now have ${this.playerMoney}.\nSo far you have won ${this.playerMoney / this.numRounds} per hand.\nYour opponent has bet ${this.oppBetCount} out of ${this.numRounds} hands, for an observed frequency of ${this.oppBetCount / this.numRounds}.`);
            }
        }
    }
    playRounds(numRounds, autocall = false) {
        for (let i = 0; i < numRounds; i++) {
            this.playRound(autocall);
        }
    }
    playRound(autocall = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loopRunning = true;
            this.numRounds += 1;
            this.gameMessage.innerHTML += ("<br>########### NEW ROUND ##########<br>");
            this.gameMessage.innerHTML += (`There is ${this.potSize} in the pot.<br>`);
            this.oppCard = this.drawCard();
            if (this.oppCard === 'Q' && Math.random() <= this.oppBluffFreq) {
                this.oppBluffCount += 1;
                this.getBet(this.oppBetSize, this.potSize, autocall);
                this.gameMessage.innerHTML += (`Opponent checks and shows a Q. You win $1. You now have ${this.playerMoney}<br>`);
            }
            else {
                const action = yield this.waitForButtonClick("callButton", "foldButton");
            }
            console.log(`clicked`);
        });
    }
    waitForButtonClick(buttonId1, buttonId2) {
        return new Promise((resolve) => {
            const button1 = document.getElementById(buttonId1);
            const button2 = document.getElementById(buttonId2);
            const onClick1 = () => {
                cleanup();
                resolve(buttonId1); // Resolve with the ID of the button clicked
            };
            const onClick2 = () => {
                cleanup();
                resolve(buttonId2); // Resolve with the ID of the button clicked
            };
            const cleanup = () => {
                button1.removeEventListener("click", onClick1);
                button2.removeEventListener("click", onClick2);
            };
            button1.addEventListener("click", onClick1);
            button2.addEventListener("click", onClick2);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const newToyGame = new ToyBettingGame();
    console.log("toy game v5 loaded");
    newToyGame.playRounds(5);
    console.log('\n======== Game Over ======= \n');
    console.log(`You end with ${newToyGame.playerMoney}`);
});
