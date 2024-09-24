import CarPlate from "../vo/CarPlate";
import Cpf from "../vo/Cpf";
import Email from "../vo/Email";
import Name from "../vo/Name";

export default class Account {
  private cpf: Cpf;
  private email: Email;
  private name: Name;
  private carPlate: CarPlate;

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    carPlate: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly customerCpf: string
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(customerCpf);
    this.carPlate = new CarPlate(carPlate);
  }

  static create(
    name: string,
    email: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
    customerCpf: string
  ) {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      name,
      email,
      carPlate,
      isPassenger,
      isDriver,
      customerCpf
    );
  }

  getCpf() {
    return this.cpf.getValue();
  }

  getEmail() {
    return this.email.getValue();
  }

  setEmail(email: string) {
    this.email = new Email(email);
  }

  getName() {
    return this.name.getValue();
  }

  getCarPlate() {
    return this.carPlate.getValue();
  }
}
