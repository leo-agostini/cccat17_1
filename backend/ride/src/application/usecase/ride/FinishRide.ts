import RideRepository from "../../repository/RideRepository";
import UseCase from "../UseCase";

export default class FinishRide implements UseCase {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.finish();
    await this.rideRepository.updateRide(ride);
  }
}

type Input = {
  rideId: string;
};
