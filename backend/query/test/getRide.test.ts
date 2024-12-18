import GetRideAPIComposition from "../src/application/query/GetRideAPIComposition";
import GetRideQuery from "../src/application/query/GetRideQuery";
// import GetRideProjection from "../src/application/query/GetRideProjection";

test("Deve consultar uma ride finalizada por query", async function () {
	const rideId = "221e140d-2a73-4020-9561-987efa48f800";
	const getRideQuery = new GetRideQuery();
	const output = await getRideQuery.execute(rideId);
	console.log(output);
});

test.only("Deve consultar uma ride finalizada por api", async function () {
	const rideId = "221e140d-2a73-4020-9561-987efa48f800";
	const getRideQuery = new GetRideAPIComposition();
	const output = await getRideQuery.execute(rideId);
	console.log(output);
});

// test.only("Deve consultar uma ride finalizada por api", async function () {
// 	const rideId = "2ccd4c5d-96fd-4438-aed7-5b22a7ffd115";
// 	const getRideQuery = new GetRideProjection();
// 	const output = await getRideQuery.execute(rideId);
// 	console.log(output);
// });