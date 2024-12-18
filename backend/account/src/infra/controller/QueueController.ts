import Signup from "../../application/usecase/account/Signup";
import { inject } from "../di/Registry";
import Queue from "../queue/Queue";

export default class QueueController {
    @inject("queue")
    queue!: Queue;
    @inject("signup")
    signup!: Signup

    constructor() {
        this.queue.consume("signup", async (input: any) => {
            await this.signup.execute(input);
        })
    }
}