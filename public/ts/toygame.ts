

class ToyBettingGame {
  private playerMoney: number;
  private playerCallFreq: number;
  private playerCallCount: number;
  private oppBluffFreq: number;
  private oppBluffCount: number;
  private oppQueenCount: number;
  private oppCard: string;
  private oppAceCount: number;
  private oppBetSize: number;
  private potSize: number;
  private numRounds: number
  
  constructor() {
    this.playerMoney = 0;
    this.oppAceCount = 0;
    this.oppQueenCount = 0;
    this.potSize = 1;
    this.oppBetSize = 1;
  }

  

}

document.addEventListener("DOMContentLoaded", () => {
  console.log("toy game loaded");
  const newToyGame = new ToyBettingGame();
});
