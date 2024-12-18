export default class ProcessPayment {
    async execute(input: Input) {
      console.log("processPayment", input);
    }
  }
  
  type Input = {
    rideId: string;
    amount: number;
  };
  