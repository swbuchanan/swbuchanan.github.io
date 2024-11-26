var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
            this.playRound(autocall);
        }
    };
    ToyBettingGame.prototype.playRound = function (autocall) {
        if (autocall === void 0) { autocall = false; }
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loopRunning = true;
                        this.numRounds += 1;
                        this.gameMessage.innerHTML += ("<br>########### NEW ROUND ##########<br>");
                        this.gameMessage.innerHTML += ("There is " + this.potSize + " in the pot.<br>");
                        this.oppCard = this.drawCard();
                        if (!(this.oppCard === 'Q' && Math.random() <= this.oppBluffFreq)) return [3 /*break*/, 1];
                        this.oppBluffCount += 1;
                        this.getBet(this.oppBetSize, this.potSize, autocall);
                        this.gameMessage.innerHTML += ("Opponent checks and shows a Q. You win $1. You now have " + this.playerMoney + "<br>");
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.waitForButtonClick("callButton", "foldButton")];
                    case 2:
                        action = _a.sent();
                        _a.label = 3;
                    case 3:
                        console.log("clicked");
                        return [2 /*return*/];
                }
            });
        });
    };
    ToyBettingGame.prototype.waitForButtonClick = function (buttonId1, buttonId2) {
        return new Promise(function (resolve) {
            var button1 = document.getElementById(buttonId1);
            var button2 = document.getElementById(buttonId2);
            var onClick1 = function () {
                cleanup();
                resolve(buttonId1); // Resolve with the ID of the button clicked
            };
            var onClick2 = function () {
                cleanup();
                resolve(buttonId2); // Resolve with the ID of the button clicked
            };
            var cleanup = function () {
                button1.removeEventListener("click", onClick1);
                button2.removeEventListener("click", onClick2);
            };
            button1.addEventListener("click", onClick1);
            button2.addEventListener("click", onClick2);
        });
    };
    return ToyBettingGame;
}());
document.addEventListener("DOMContentLoaded", function () {
    var newToyGame = new ToyBettingGame();
    console.log("toy game v5 loaded");
    newToyGame.playRounds(5);
    console.log('\n======== Game Over ======= \n');
    console.log("You end with " + newToyGame.playerMoney);
});
