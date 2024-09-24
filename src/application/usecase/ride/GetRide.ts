import AccountRepository from "../../repository/AccountRepository";
import PositionRepository from "../../repository/PositionRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class GetRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
    readonly accountRepository: AccountRepository
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    const passenger = await this.accountRepository.getAccountById(
      ride.passengerId
    );
    const lastPosition =
      await this.positionRepository.getLastPositionFromRideId(rideId);

    return {
      date: ride.date,
      driverId: ride.driverId,
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      passengerId: ride.passengerId,
      passengerName: passenger.getName(),
      rideId: ride.rideId,
      status: ride.status,
      currentLat: lastPosition?.lat,
      currentLong: lastPosition?.long,
      distance: ride.distance,
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  passengerName: string;
  driverId: string;
  fromLat: number;
  distance: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  currentLat?: number;
  currentLong?: number;
};
