import AccountGateway from "../../src/application/gateway/AccountGateway";
import PaymentGateway from "../../src/application/gateway/PaymentGateway";
import AcceptRide from "../../src/application/usecase/ride/AcceptRide";
import FinishRide from "../../src/application/usecase/ride/FinishRide";
import GetRide from "../../src/application/usecase/ride/GetRide";
import RequestRide from "../../src/application/usecase/ride/RequestRide";
import StartRide from "../../src/application/usecase/ride/StartRide";
import UpdatePosition from "../../src/application/usecase/ride/UpdatePosition";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import PaymentGatewayHttp from "../../src/infra/gateway/PaymentGatewayHttp";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import Queue, { RabbitMQAdapter } from "../../src/infra/queue/Queue";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let accountGateway: AccountGateway;
let finishRide: FinishRide;
let paymentGateway: PaymentGateway;
let queue: Queue;


beforeEach(async () => {
  connection = new PgPromiseAdapter();
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const axiosAdapter = new AxiosAdapter();
  queue = new RabbitMQAdapter();
  queue.connect()
  accountGateway = new AccountGatewayHttp(axiosAdapter);
  requestRide = new RequestRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository, positionRepository, accountGateway);
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
  paymentGateway = new PaymentGatewayHttp(axiosAdapter)
  finishRide = new FinishRide(rideRepository, paymentGateway, queue);
});

afterEach(async () => {
  await connection.close();
  await queue?.disconnect();
});

test("Deve finalizar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	}
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const inputStartRide = {
		rideId: outputRequestRide.rideId
	}
	await startRide.execute(inputStartRide);
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: -27.584905257808835,
		long: -48.545022195325124,
		date: new Date("2023-03-01T10:00:00")
	}
	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: -27.496887588317275,
		long: -48.522234807851476,
		date: new Date("2023-03-01T10:10:00")
	}
	await updatePosition.execute(inputUpdatePosition1);
	await updatePosition.execute(inputUpdatePosition2);
	const inputFinishRide = {
		rideId: outputRequestRide.rideId,
	}
	await finishRide.execute(inputFinishRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("completed");
	console.log(outputGetRide)
});
