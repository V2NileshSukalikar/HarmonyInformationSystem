import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../extensions/rxjs-extensions';

import { Config } from '../models/config';
import { Data } from '../models/data';

@Injectable()
export class PagedataService {

    GlobalData = {} as any;
    config = new Config();
    pagecounter = 0 as number;
    selectedlink: string;
    searchData: any[] = [];
    private data: any = {};
    private observable: Observable<any>;

    constructor(private http: Http) {
    };

    getsearchData(searchText: string, typeId: number): any {

        const url = this.config.Searchurl + '/' + searchText + '/' + typeId;
        return this.http
            .get(url)
            .map((response: Response) => response.json() as any[])
            .do(data => console.log(data))
            .catch(this.handleError);
    }

    getData(pageName: string, isHeader: boolean): any {
        if (this.data) {
            if (this.data.PageName === pageName) {
                if (this.data.pagespecificData.isCacheble) {
                    return Observable.of(this.data);
                } else {
                    return this.getDataFromServe(pageName, isHeader);
                }
            } else {
                return this.isLocalStorageDataAvailable(pageName, isHeader);
            }
        } else if (this.observable) {
            // if `this.observable` is set then the request is in progress
            // return the `Observable` for the ongoing request
            return this.observable;
        } else {
            return this.isLocalStorageDataAvailable(pageName, isHeader);
        }
    }

    private isLocalStorageDataAvailable(pageName: string, isHeader: boolean): any {
        const storagedata: any = {};
        const isGlobalDataAvailable = localStorage.getItem('global') === 'undefined' ? null : localStorage.getItem('global');
        const isPageDataAvailable = localStorage.getItem(pageName) === 'undefined' ? null : localStorage.getItem(pageName);

        storagedata.GlobalData = JSON.parse(isGlobalDataAvailable);
        if (isPageDataAvailable != null) {
            storagedata.pagespecificData = JSON.parse(isPageDataAvailable);
            storagedata.PageName = pageName;
            this.data = storagedata;
            return Observable.of(this.data);
        } else {
            return this.getDataFromServe(pageName, isHeader);
        }
    }

    private getDataFromServe(pageName: string, isHeader: boolean): any {
        const url = this.config.apiURl + '/' + pageName + '/' + isHeader;
        // example header (not necessary)
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // create the request, store the `Observable` for subsequent subscribers
        this.observable = this.http.get(url, {
            headers: headers
        })
            .map(response => {
                // when the cached data is available we don't need the `Observable` reference anymore
                this.observable = null;
                if (response.status === 400) {
                    return 'FAILURE';
                } else if (response.status === 200) {
                    const result = response.json() as any;
                    this.data.GlobalData = result.g;
                    this.data.pagespecificData = result.s;
                    this.data.PageName = result.pageName;
                    if (localStorage.getItem('global') == null || localStorage.getItem('global') === 'undefined') {
                        localStorage.setItem('global', JSON.stringify(this.data.GlobalData));
                    }
                    if (this.data.pagespecificData.isCacheble) {
                        localStorage.setItem(pageName, JSON.stringify(this.data.pagespecificData));
                    } else {
                        if (localStorage.getItem(pageName) != null) {
                            localStorage.removeItem(pageName);
                        }
                    }
                    return this.data;
                }
                // make it shared so more than one subscriber can get the result
            })
            .share();
        return this.observable;
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.log(errMsg);
        return Observable.throw(errMsg);
    }

}
