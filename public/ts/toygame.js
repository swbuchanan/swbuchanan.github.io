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
        }
    };
    return ToyBettingGame;
}());
document.addEventListener("DOMContentLoaded", function () {
    console.log("toy game loaded...");
    var newToyGame = new ToyBettingGame();
    newToyGame.getBet(18);
});
