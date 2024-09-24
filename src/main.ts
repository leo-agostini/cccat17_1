import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import API from "./infra/controller/AccountController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Signup from "./application/usecase/account/Signup";
import MailerGatewayFake from "./infra/gateway/MailerGatewayFake";
import GetAccount from "./application/usecase/account/GetAccount";

const connection = new PgPromiseAdapter();
const AccountRepository = new AccountRepositoryDatabase(connection);
const MailerGateway = new MailerGatewayFake();
const signup = new Signup(AccountRepository, MailerGateway);
const getAccount = new GetAccount(AccountRepository);
const httpServer = new ExpressAdapter();
const api = new API(httpServer, signup, getAccount);
api.build();
httpServer.listen(3000);
