import AccountRepository from "../../repository/AccountRepository";
import UseCase from "../UseCase";

export default class GetAccount implements UseCase {
  accountRepositoryDatabase: AccountRepository;

  constructor(accountRepositoryDatabase: AccountRepository) {
    this.accountRepositoryDatabase = accountRepositoryDatabase;
  }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepositoryDatabase.getAccountById(
      accountId
    );
    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      carPlate: account.getCarPlate(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
    };
  }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};
