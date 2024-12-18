import Transaction from "../../../domain/Transaction";
import PaymentGateway from "../../gateway/PaymentGateway";
import TransactionRepository from "../../repository/TransactionRepository";

export default class ProcessPayment {
  constructor(
    readonly transactionRepository: TransactionRepository,
    readonly paymentGateway: PaymentGateway
  ) {}

  async execute(input: Input) {
    console.log(input)
    const transaction = Transaction.create(input.rideId, input.amount);
    const inputCreateTransaction = {
      cardHolder: "Cliente exemplo",
      creditCardNumber: "4012001037141112",
      expDate: "05/2027",
      cvv: "123",
      amount: transaction.amount,
    };

    const outputCreateTransaction = await this.paymentGateway.createTransaction(
      inputCreateTransaction
    );

    if (outputCreateTransaction.status === "approved") {
      transaction.approve();
    } else transaction.reject();

    await this.transactionRepository.saveTransaction(transaction);
    return {
      transactionId: transaction.transactionId,
    };
  }
}

type Input = {
  rideId: string;
  amount: number;
};
