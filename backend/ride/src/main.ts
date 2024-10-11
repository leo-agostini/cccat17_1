import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";

const connection = new PgPromiseAdapter();
const httpServer = new ExpressAdapter();

httpServer.listen(3000);
