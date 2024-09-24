import MailerGateway from "../../src/application/gateway/MailerGateway";
import Signup from "../../src/application/usecase/account/Signup";
import AcceptRide from "../../src/application/usecase/ride/AcceptRide";
import GetRide from "../../src/application/usecase/ride/GetRide";
import RequestRide from "../../src/application/usecase/ride/RequestRide";
import StartRide from "../../src/application/usecase/ride/StartRide";
import UpdatePosition from "../../src/application/usecase/ride/UpdatePosition";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
import MailerGatewayFake from "../../src/infra/gateway/MailerGatewayFake";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";

let connection: DatabaseConnection;
let signup: Signup;
let mailerGatewayFake: MailerGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  mailerGatewayFake = new MailerGatewayFake();
  signup = new Signup(accountRepository, mailerGatewayFake);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, positionRepository, accountRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
});

afterEach(async () => {
  await connection.close();
});

test("Deve atualizar a posição de uma corrida", async () => {
  const inputSignupPassenger = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const inputSignupDriver = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    carPlate: "AAA9999",
    isDriver: true,
  };

  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  const inputStartRide = { rideId: outputRequestRide.rideId };

  await acceptRide.execute(inputAcceptRide);
  await startRide.execute(inputStartRide);

  // update position
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  };
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  };
  // update position

  await updatePosition.execute(inputUpdatePosition1);
  await updatePosition.execute(inputUpdatePosition2);

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.currentLat).toBe(-27.496887588317275);
  expect(outputGetRide.currentLong).toBe(-48.522234807851476);
  expect(outputGetRide.distance).toBe(10);
});
