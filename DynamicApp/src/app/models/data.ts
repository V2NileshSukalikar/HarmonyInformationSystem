export class Data {
    response: string;
    constructor(json) {
        this.response = json.status;
    }
}