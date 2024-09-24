import sinon from "sinon";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
import Signup from "../../src/application/usecase/account/Signup";
import MailerGateway from "../../src/application/gateway/MailerGateway";
import MailerGatewayFake from "../../src/infra/gateway/MailerGatewayFake";
import Account from "../../src/domain/entity/Account";
import GetAccount from "../../src/application/usecase/account/GetAccount";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let mailerGatewayFake: MailerGateway;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  mailerGatewayFake = new MailerGatewayFake();
  signup = new Signup(accountRepository, mailerGatewayFake);
  getAccount = new GetAccount(accountRepository);
});

afterEach(async () => {
  await connection.close();
});

test("Deve criar uma conta para o passageiro", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const output = await signup.execute(input);
  expect(output.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve criar uma conta para o motorista", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isDriver: true,
    carPlate: "AAA9999",
  };

  const output = await signup.execute(input);
  expect(output.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.carPlate).toBe(input.carPlate);
});

test("Não deve criar uma conta para o passageiro com o nome inválido", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "",
    cpf: "87748248800",
    isPassenger: true,
  };

  expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar uma conta para o passageiro com o email inválido", async () => {
  const input = {
    email: `johndoe${Math.random()}gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Não deve criar uma conta para o passageiro com o CPF inválido", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "8774824880000",
    isPassenger: true,
  };

  expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test("Não deve criar uma conta para o passageiro com o email duplicado", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  await signup.execute(input);
  expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});

test("Não deve criar uma conta para o motorista com a placa inválida", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isDriver: true,
    carPlate: "AAA999",
  };

  expect(() => signup.execute(input)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

test("Deve criar uma conta para o passageiro com stub do MailerGateway", async () => {
  const stub = sinon.stub(MailerGatewayFake.prototype, "send").resolves();

  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const output = await signup.execute(input);
  expect(output.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);

  stub.restore();
});

test("Deve criar uma conta para o passageiro com stub do AccountRepository", async () => {
  const email = `johndoe${Math.random()}@gmail.com`;
  const inputSignupStub = Account.create(
    "John Doe",
    email,
    "",
    true,
    false,
    "87748248800"
  );
  const inputSignup = {
    email,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const stubSaveAccount = sinon
    .stub(AccountRepositoryDatabase.prototype, "saveAccount")
    .resolves();
  const stubGetAccountByEmail = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountByEmail")
    .resolves(undefined);
  const stubGetAccountById = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountById")
    .resolves(inputSignupStub);

  const output = await signup.execute(inputSignup);
  expect(output.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(output.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);

  stubSaveAccount.restore();
  stubGetAccountByEmail.restore();
  stubGetAccountById.restore();
});

test("Deve criar uma conta para o passageiro com spy no Mailer gateway", async () => {
  const spySend = sinon.spy(MailerGatewayFake.prototype, "send");

  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const output = await signup.execute(input);
  expect(output.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(spySend.calledOnce).toBe(true);
  spySend.restore();
});

test("Deve criar uma conta para o passageiro com mock no Mailer gateway", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "87748248800",
    isPassenger: true,
  };

  const mockMailerGateway = sinon.mock(MailerGatewayFake.prototype);
  mockMailerGateway.expects("send").withArgs(input.email, "Welcome", "").once();

  const output = await signup.execute(input);
  expect(output.accountId).toBeDefined();

  const outputGetAccount = await getAccount.execute(output.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);

  mockMailerGateway.verify();
  mockMailerGateway.restore();
});
