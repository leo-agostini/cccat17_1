import Ride from "../../src/domain/entity/Ride";

test("Não deve criar uma corrida com a coordenada inválida", () => {
  expect(() => Ride.create("", -180, 180, -180, 180)).toThrow(
    new Error("Invalid latitude")
  );
});
