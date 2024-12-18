import GetRide from "../../application/usecase/ride/GetRide";
import RequestRide from "../../application/usecase/ride/RequestRide";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class RideController {
  constructor(
    readonly httpServer: HttpServer,
    readonly requestRide: RequestRide,
    readonly getRide: GetRide,
    readonly queue: Queue
  ) {
    httpServer.register(
      "post",
      "/request_ride",
      async (_: any, body: any) => {
        const response = await requestRide.execute(body);
        return response;
      }
    );

    
    httpServer.register(
      "get",
      "/rides/:rideId",
      async (params: any) => {
        const response = await getRide.execute(params.rideId);
        return response;
      }
    );


   
    httpServer.register(
      "post",
      "/request_ride_async",
      async (_: any, body: any) => {
        // + escalabilidade, resiliência, independência
        // command e/ou handler - intenção de executar
        await queue.publish("requestRide", body);
      }
    );
  }
}
