import { Headers, Http } from '@angular/http';

export class Config {

    public headers: Headers;
    public apiURl: string;
    public Searchurl: string;

    constructor() {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.apiURl = 'http://harmonyservice/api/CMSData/GetCMSJsonData';
        this.Searchurl = 'http://harmonyservice/api/GetFilteredRecords';
    }
}
