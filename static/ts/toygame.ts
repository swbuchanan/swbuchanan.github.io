

class ToyBettingGame {
  public playerMoney: number;
  private playerCallFreq: number;
  private playerCallCount: number;
  public  oppBluffFreq: number;
  public  oppBluffCount: number;
  private oppQueenCount: number;
  private oppCard: string;
  private oppAceCount: number;
  private oppBetCount: number;
  private oppBetSize: number;
  private potSize: number;
  private numRounds: number
  public optimalCallFreq: number;
  private gameMessage: HTMLElement;
  private callButton: HTMLButtonElement;
  private foldButton: HTMLButtonElement;

  
  constructor() {
    this.playerMoney = 0;
    this.oppAceCount = 0;
    this.oppQueenCount = 0;
    this.potSize = 1;
    this.oppBetCount = 0;
    this.oppBetSize = 1;
    this.numRounds = 0;

    this.gameMessage = document.getElementById("game-message") as HTMLParagraphElement;
    this.callButton = document.getElementById("call") as HTMLButtonElement;
    this.foldButton = document.getElementById("fold") as HTMLButtonElement;
    this.callButton.addEventListener("click", () => this.playerCall());
    this.foldButton.addEventListener("click", () => this.playerFold());
  }

  private playerCall() {
    console.log("call");
    this.playerCallCount += 1;
    if (this.oppCard === 'Q') {
      this.playerMoney += 2;
      this.gameMessage.innerHTML += (`You call. Your opponent shows a Q and you win the pot. You now have ${this.playerMoney}.\nSo far you have won ${this.playerMoney/this.numRounds} per hand.\nYour opponent has bet ${this.oppBetCount} out of ${this.numRounds} hands, for an observed frequency of ${this.oppBetCount/this.numRounds}.`);
    } else if (this.oppCard = 'A') {
      this.playerMoney -= 1;
      this.gameMessage.innerHTML += (`You call. Your opponent shows an Ace and you lose the pot. You now have ${this.playerMoney}.\nSo far you have won ${this.playerMoney/this.numRounds} per hand.\nYour opponent has bet ${this.oppBetCount} out of ${this.numRounds} hands, for an observed frequency of ${this.oppBetCount/this.numRounds}.`);
    }
  }

  private playerFold() {
    this.gameMessage.innerHTML = (`You fold<br>`);
  }

  private drawCard(): string {
    const randomIdx = Math.random() < 0.5 ? 0 : 1;  
    const card = ['A','Q'][randomIdx];
    if (card === 'A') {
      this.oppAceCount += 1;
    } else if (card === 'Q') {
      this.oppQueenCount += 1;
    }
    return card;
  }

  public getBet(betAmt: number, potAmt = 1, autocall: boolean = false): void {
    console.log(`\nYour opponent bets ${betAmt} into a pot of ${potAmt}, bringing the total pot to ${betAmt + potAmt}.`);
    this.gameMessage.innerHTML += (`<br>Your opponent bets ${betAmt} into a pot of ${potAmt}, bringing the total pot to ${betAmt + potAmt}.`);
    this.oppBetCount += 1;
    let action: string;
//    if (!autocall) {
//      action = prompt('Write c to call or f to fold.');
//    } else {
//      action = Math.random() < this.playerCallFreq ? 'c' : 'f';
//    }
  

    if (action === 'f') {
      console.log('You fold and forfeit the pot.');
    } else if (action === 'c') {
      this.playerCall();
    }
  }

  public playRounds(numRounds: number, autocall: boolean = false) {
    for (let i = 0; i < numRounds; i++) {
      this.playRound(autocall);
    }
  }

  private playRound(autocall: boolean = false) {

    this.numRounds += 1;
    this.gameMessage.innerHTML += ("<br>########### NEW ROUND ##########<br>");
    this.gameMessage.innerHTML += (`There is ${this.potSize} in the pot.<br>`);
    this.oppCard = this.drawCard();
    if (this.oppCard === 'Q' && Math.random() <= this.oppBluffFreq) {
        this.oppBluffCount += 1;
        this.getBet(this.oppBetSize, this.potSize, autocall);
        this.gameMessage.innerHTML += (`Opponent checks and shows a Q. You win $1. You now have ${this.playerMoney}<br>`);
    } else {
      this.gameMessage.innerHTML += (`idk`);
    }

    console.log(`clicked`);
  }


  

}

document.addEventListener("DOMContentLoaded", () => {
  const newToyGame = new ToyBettingGame();

  console.log("toy game v6 loaded");

  newToyGame.playRounds(5);
  console.log('\n======== Game Over ======= \n');
  console.log(`You end with ${newToyGame.playerMoney}`)
});
