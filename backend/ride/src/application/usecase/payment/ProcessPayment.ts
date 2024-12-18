export default class ProcessPayment {
  execute(input: Input) {
    console.log("processPayment", input);
  }
}

type Input = {
  rideId: string;
  amount: number;
};
