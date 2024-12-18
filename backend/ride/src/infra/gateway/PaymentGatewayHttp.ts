import PaymentGateway from "../../application/gateway/PaymentGateway";
import HttpClient from "../http/HttpClient";

export default class PaymentGatewayHttp implements PaymentGateway {
  constructor(readonly httpClient: HttpClient) {}

  async processPayment(input: any): Promise<any> {
    const response = await this.httpClient.post(
      `http://localhost:3002/process_payment`,
      input
    );
    
    return response.data;
  }
}
