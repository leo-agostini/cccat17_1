import AccountGateway from "../../gateway/AccountGateway";
import PositionRepository from "../../repository/PositionRepository";
import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class GetRide implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
    readonly accountGateway: AccountGateway
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    const passenger = await this.accountGateway.getAccountById(
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
      passengerName: passenger.name,
      rideId: ride.rideId,
      status: ride.status,
      currentLat: lastPosition?.lat,
      currentLong: lastPosition?.long,
      distance: ride.distance,
      fare: ride.fare,
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
  fare: number;
  toLong: number;
  status: string;
  date: Date;
  currentLat?: number;
  currentLong?: number;
};
