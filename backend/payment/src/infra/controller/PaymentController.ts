import GetTransactionByRideId from "../../application/usecase/payment/GetTransactionByRideId";
import ProcessPayment from "../../application/usecase/payment/ProcessPayment";
import HttpServer from "../http/HttpServer";

export default class PaymentController {
  constructor(
    readonly httpServer: HttpServer,
    readonly processPayment: ProcessPayment,
    readonly getTransactionByRideId: GetTransactionByRideId
  ) {
    httpServer.register(
      "post",
      "/process_payment",
      async (params: any, body: any) => {
        await processPayment.execute(body);
      }
    );

    httpServer.register("get", "/transactions/:rideId", async (params: any) => {
      console.log(params)
      const response = await getTransactionByRideId.execute(params.rideId);
      return response;
    });
  }
}
