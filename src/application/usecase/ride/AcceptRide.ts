import Ride from "../../../domain/entity/Ride";
import AccountRepository from "../../repository/AccountRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class AcceptRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository
  ) {}

  async execute(input: Input): Promise<void> {
    const hasActiveRides = await this.rideRepository.hasActiveRideByDriverId(
      input.driverId
    );
    if (hasActiveRides) throw new Error("This driver has an active ride");
    const account = await this.accountRepository.getAccountById(input.driverId);
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.accept(account);
    await this.rideRepository.updateRide(ride);
  }
}

type Input = {
  driverId: string;
  rideId: string;
};
