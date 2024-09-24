import GetAccount from "../../application/usecase/account/GetAccount";
import Signup from "../../application/usecase/account/Signup";
import HttpServer from "../http/HttpServer";

export default class API {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount
  ) {}

  build() {
    this.httpServer.register(
      "post",
      "/signup",
      async (params: any, body: any) => {
        const input = body;
        const output = await this.signup.execute(input);
        return output;
      }
    );

    this.httpServer.register(
      "get",
      "/accounts/:accountId",
      async (params: any, body: any) => {
        const accountId = params.accountId;
        const output = await this.getAccount.execute(accountId);
        return output;
      }
    );
  }
}
