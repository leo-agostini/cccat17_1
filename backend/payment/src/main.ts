import GetTransaction from "./application/usecase/payment/GetTransaction";
import GetTransactionByRideId from "./application/usecase/payment/GetTransactionByRideId";
import ProcessPayment from "./application/usecase/payment/ProcessPayment";
import PaymentController from "./infra/controller/PaymentController";
import QueueController from "./infra/controller/QueuController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import PJBankGateway from "./infra/gateway/PJBankGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";
import ORM from "./infra/orm/ORM";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import TransactionRepositoryORM from "./infra/repository/TransactionRepositoryORM";

(async () => {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter()
  const orm = new ORM(connection);
  
  const transactionRepository = new TransactionRepositoryORM(orm);
  const getTransaction = new GetTransactionByRideId(transactionRepository);
  
  const paymentGateway = new PJBankGateway()
  
  const processPayment = new ProcessPayment(transactionRepository, paymentGateway);
  
  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.setup("rideCompleted", "rideCompleted.processPayment");
  new PaymentController(httpServer, processPayment, getTransaction);
  new QueueController(queue, processPayment);
  httpServer.listen(3002);
})();
