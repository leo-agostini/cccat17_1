export default interface PaymentGateway {
  createTransaction(input: any): Promise<any>;
}
