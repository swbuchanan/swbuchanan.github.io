var ToyBettingGame = /** @class */ (function () {
    function ToyBettingGame() {
        var _this = this;
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
        this.callButton.addEventListener("click", function () { return _this.playerCall(); });
        this.foldButton.addEventListener("click", function () { return _this.playerFold(); });
    }
    ToyBettingGame.prototype.playerCall = function () {
        console.log("call");
        this.playerCallCount += 1;
        if (this.oppCard === 'Q') {
            this.playerMoney += 2;
            this.gameMessage.innerHTML += ("You call. Your opponent shows a Q and you win the pot. You now have " + this.playerMoney + ".\nSo far you have won " + this.playerMoney / this.numRounds + " per hand.\nYour opponent has bet " + this.oppBetCount + " out of " + this.numRounds + " hands, for an observed frequency of " + this.oppBetCount / this.numRounds + ".");
        }
        else if (this.oppCard = 'A') {
            this.playerMoney -= 1;
            this.gameMessage.innerHTML += ("You call. Your opponent shows an Ace and you lose the pot. You now have " + this.playerMoney + ".\nSo far you have won " + this.playerMoney / this.numRounds + " per hand.\nYour opponent has bet " + this.oppBetCount + " out of " + this.numRounds + " hands, for an observed frequency of " + this.oppBetCount / this.numRounds + ".");
        }
    };
    ToyBettingGame.prototype.playerFold = function () {
        this.gameMessage.innerHTML = ("You fold<br>");
    };
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
        console.log("\nYour opponent bets " + betAmt + " into a pot of " + potAmt + ", bringing the total pot to " + (betAmt + potAmt) + ".");
        this.gameMessage.innerHTML += ("<br>Your opponent bets " + betAmt + " into a pot of " + potAmt + ", bringing the total pot to " + (betAmt + potAmt) + ".");
        this.oppBetCount += 1;
        var action;
        //    if (!autocall) {
        //      action = prompt('Write c to call or f to fold.');
        //    } else {
        //      action = Math.random() < this.playerCallFreq ? 'c' : 'f';
        //    }
        if (action === 'f') {
            console.log('You fold and forfeit the pot.');
        }
        else if (action === 'c') {
            this.playerCall();
        }
    };
    ToyBettingGame.prototype.playRounds = function (numRounds, autocall) {
        if (autocall === void 0) { autocall = false; }
        for (var i = 0; i < numRounds; i++) {
            this.playRound(autocall);
        }
    };
    ToyBettingGame.prototype.playRound = function (autocall) {
        if (autocall === void 0) { autocall = false; }
        this.numRounds += 1;
        this.gameMessage.innerHTML += ("<br>########### NEW ROUND ##########<br>");
        this.gameMessage.innerHTML += ("There is " + this.potSize + " in the pot.<br>");
        this.oppCard = this.drawCard();
        if (this.oppCard === 'Q' && Math.random() <= this.oppBluffFreq) {
            this.oppBluffCount += 1;
            this.getBet(this.oppBetSize, this.potSize, autocall);
            this.gameMessage.innerHTML += ("Opponent checks and shows a Q. You win $1. You now have " + this.playerMoney + "<br>");
        }
        else {
            this.gameMessage.innerHTML += ("idk");
        }
        console.log("clicked");
    };
    return ToyBettingGame;
}());
document.addEventListener("DOMContentLoaded", function () {
    var newToyGame = new ToyBettingGame();
    console.log("toy game v6 loaded");
    newToyGame.playRounds(5);
    console.log('\n======== Game Over ======= \n');
    console.log("You end with " + newToyGame.playerMoney);
});
