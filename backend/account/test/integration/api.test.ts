import axios from "axios";

test("Deve criar uma conta de passageiro", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "97456321558",
    isPassenger: true,
  };

  const { data: outputSignup } = await axios.post(
    "http://localhost:3001/signup",
    input
  );
  expect(outputSignup.accountId).toBeDefined();

  const { data: outputGetAccount } = await axios.get(
    `http://localhost:3001/accounts/${outputSignup.accountId}`
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
});

test.only("Deve criar uma conta de passageiro pela api async", async () => {
  const input = {
    email: `johndoe${Math.random()}@gmail.com`,
    name: "John Doe",
    cpf: "97456321558",
    isPassenger: true,
  };

  await axios.post("http://localhost:3001/signup_async", input);
});
