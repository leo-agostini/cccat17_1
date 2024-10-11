import AccountGateway from "../../src/application/gateway/AccountGateway";
import GetRide from "../../src/application/usecase/ride/GetRide";
import RequestRide from "../../src/application/usecase/ride/RequestRide";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import PositionRepositoryDatabase from "../../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepositoryDatabase";

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const axiosAdapter = new AxiosAdapter();
  accountGateway = new AccountGatewayHttp(axiosAdapter);
  getRide = new GetRide(rideRepository, positionRepository, accountGateway);
  requestRide = new RequestRide(rideRepository, accountGateway);
});

afterEach(async () => {
  await connection.close();
});

test("Deve solicitar uma corrida", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const output = await accountGateway.signup(input);
  const inputRequestRide = {
    passengerId: output.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };

  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();

  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
  expect(outputGetRide.passengerName).toBe("John Doe");
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
  expect(outputGetRide.status).toBe("requested");
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: false,
    isDriver: true,
    carPlate: "AAA9999",
  };

  const output = await accountGateway.signup(input);
  const inputRequestRide = {
    passengerId: output.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("This account is not from a passenger")
  );
});

test("Não deve poder solicitar uma se o passageiro já tiver outra corrida não finalizada", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const output = await accountGateway.signup(input);
  const inputRequestRide = {
    passengerId: output.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };

  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("This passenger has an active ride")
  );
});
