import TransactionRepository from "../../repository/TransactionRepository";

export default class GetTransaction {
  constructor(readonly transactionRepository: TransactionRepository) {}

  async execute(transactionId: string) {
    const transaction = await this.transactionRepository.getTransactionById(
      transactionId
    );
    return transaction;
  }
}
