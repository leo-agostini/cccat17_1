import AccountRepository from "../../application/repository/AccountRepository";
import DatabaseConnection from "../database/DatabaseConnection";
import Account from "../../domain/entity/Account";

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getAccountByEmail(email: string): Promise<Account | undefined> {
    const [accountData] = await this.connection.query(
      "select * from cccat17.account where email = $1",
      [email]
    );

    if (!accountData) return;
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.cpf
    );
  }

  async saveAccount(account: Account) {
    await this.connection.query(
      "insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.accountId,
        account.getName(),
        account.getEmail(),
        account.getCpf(),
        account.getCarPlate(),
        !!account.isPassenger,
        !!account.isDriver,
      ]
    );
  }

  async getAccountById(id: string) {
    const [accountData] = await this.connection.query(
      "select * from cccat17.account where account_id = $1",
      [id]
    );

    if (!accountData) throw new Error("Account not find");
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.cpf
    );
  }
}

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[];

  constructor() {
    this.accounts = [];
  }

  async getAccountByEmail(email: string): Promise<Account | undefined> {
    const account = this.accounts.find(
      (account) => account.getEmail() === email
    );

    if (!account) return;
    return account;
  }
  async getAccountById(id: string): Promise<Account> {
    const account = this.accounts.find((account) => account.accountId === id);
    if (!account) throw new Error("Account not find");
    return account;
  }
  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
