var ToyBettingGame = /** @class */ (function () {
    function ToyBettingGame() {
        this.playerMoney = 0;
        this.oppAceCount = 0;
        this.oppQueenCount = 0;
        this.potSize = 1;
        this.oppBetCount = 0;
        this.oppBetSize = 1;
    }
    ToyBettingGame.prototype.drawCard = function () {
        var randomIdx = Math.random() < 0.5 ? 0 : 1;
        var card = ['A', 'Q'][randomIdx];
        if (card === 'A') {
            this.oppAceCount += 1;
        }
        else if (card === 'Q') {
            this.oppQueenCount += 1;
        }
        return card;
    };
    ToyBettingGame.prototype.getBet = function (betAmt, potAmt, autocall) {
        if (potAmt === void 0) { potAmt = 1; }
        if (autocall === void 0) { autocall = false; }
        console.log("Your opponent bets " + betAmt + " into a pot of " + potAmt + ", bringing the total pot to " + (betAmt + potAmt) + ".");
        this.oppBetCount += 1;
        var action;
        if (!autocall) {
            action = prompt('Write c to call or f to fold.');
        }
        else {
            action = Math.random() < this.playerCallFreq ? 'c' : 'f';
        }
        if (action === 'f') {
            console.log('You fold and forfeit the pot.');
        }
        else if (action === 'c') {
            this.playerCallCount += 1;
            if (this.oppCard === 'Q') {
                this.playerMoney += 2;
                console.log("You call. Your opponent shows a Q and you win the pot. You now have " + this.playerMoney + ".\nSo far you have won " + this.playerMoney / this.numRounds + " per hand.\nYour opponent has bet " + this.oppBetCount + " out of " + this.numRounds + " hands, for an observed frequency of " + this.oppBetCount / this.numRounds + ".");
            }
            else if (this.oppCard = 'A') {
                this.playerMoney -= 1;
                console.log("You call. Your opponent shows an Ace and you lose the pot. You now have " + this.playerMoney + ".\nSo far you have won " + this.playerMoney / this.numRounds + " per hand.\nYour opponent has bet " + this.oppBetCount + " out of " + this.numRounds + " hands, for an observed frequency of " + this.oppBetCount / this.numRounds + ".");
            }
        }
    };
    ToyBettingGame.prototype.playRounds = function (numRounds, autocall) {
        if (autocall === void 0) { autocall = false; }
        for (var i = 0; i < numRounds; i++) {
            this.numRounds += 1;
            this.playRound(autocall);
        }
    };
    ToyBettingGame.prototype.playRound = function (autocall) {
        if (autocall === void 0) { autocall = false; }
        console.log("\n ########### NEW ROUND ########## \n");
        console.log("There is " + this.potSize + " in the pot.");
        this.oppCard = this.drawCard();
        if (this.oppCard === 'A') {
            this.getBet(this.oppBetSize, this.potSize, autocall);
        }
        else if (this.oppCard === 'Q') {
            if (Math.random() <= this.oppBluffFreq) {
                this.oppBluffCount += 1;
                this.getBet(this.oppBetSize, this.potSize, autocall);
            }
            else {
                this.playerMoney += 1;
                console.log("Opponent checks and shows a Q. You win $1. You now have " + this.playerMoney);
            }
        }
    };
    return ToyBettingGame;
}());
document.addEventListener("DOMContentLoaded", function () {
    console.log("toy game v2 loaded...");
    var newToyGame = new ToyBettingGame();
    newToyGame.playRounds(5);
});
