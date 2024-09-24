import Account from "../../../domain/entity/Account";
import MailerGateway from "../../gateway/MailerGateway";
import UseCase from "../UseCase";
import AccountRepository from "../../repository/AccountRepository";

export default class Signup implements UseCase {
  accountRepositoryDatabase: AccountRepository;
  mailerGateway: MailerGateway;

  constructor(
    accountRepositoryDatabase: AccountRepository,
    mailerGateway: MailerGateway
  ) {
    this.accountRepositoryDatabase = accountRepositoryDatabase;
    this.mailerGateway = mailerGateway;
  }

  async execute(input: Input): Promise<Output> {
    const account = Account.create(
      input.name,
      input.email,
      input.carPlate || "",
      !!input.isPassenger,
      !!input.isDriver,
      input.cpf
    );

    const existingAccount =
      await this.accountRepositoryDatabase.getAccountByEmail(input.email);

    if (existingAccount) throw new Error("Account already exists");

    await this.accountRepositoryDatabase.saveAccount(account);
    this.mailerGateway.send(account.getEmail(), "Welcome", "");

    return { accountId: account.accountId };
  }
}

// DTOs
type Input = {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
};

type Output = {
  accountId: string;
};
