import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { RabbitMQAdapter } from "./infra/queue/Queue";

(async () => {
  const queue = new RabbitMQAdapter();
  await queue.connect();
  await queue.setup("rideRequested", "rideRequested.updateProjection");
  await queue.setup("rideAccepted", "rideAccepted.updateProjection");
  await queue.setup("rideCompleted", "rideCompleted.updateProjection");
  queue.consume("rideRequested.updateProjection", console.log)
  queue.consume("rideAccepted.updateProjection", console.log)
  queue.consume("rideCompleted.updateProjection", console.log)
})();
