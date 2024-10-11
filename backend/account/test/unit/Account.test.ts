import Account from "../../src/domain/entity/Account";

test("Deve criar uma account com senha plain", function () {
    const account = Account.create("John Doe", "john.doe@gmail.com", "12916428976", "AAA9999", false, true, "123456", "plain");
    expect(account.verifyPassword("123456")).toBe(true);
});

test("Deve criar uma account com senha md5", function () {
    const account = Account.create("John Doe", "john.doe@gmail.com", "12916428976", "AAA9999", false, true, "123456", "md5");
    expect(account.verifyPassword("123456")).toBe(true);
});