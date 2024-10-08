import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Signup from "./application/usecase/account/Signup";
import MailerGatewayFake from "./infra/gateway/MailerGatewayFake";
import GetAccount from "./application/usecase/account/GetAccount";
import AccountController from "./infra/controller/AccountController";
import Registry from "./infra/di/Registry";

const connection = new PgPromiseAdapter();
const AccountRepository = new AccountRepositoryDatabase(connection);
const MailerGateway = new MailerGatewayFake();
const signup = new Signup(AccountRepository, MailerGateway);
const getAccount = new GetAccount(AccountRepository);
const httpServer = new ExpressAdapter();
const accountController = new AccountController(httpServer);

Registry.getInstance().provide("signup", signup);
Registry.getInstance().provide("getAccount", getAccount);

accountController.build();
httpServer.listen(3000);
