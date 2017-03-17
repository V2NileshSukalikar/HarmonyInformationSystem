import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../extensions/rxjs-extensions';

import { Config } from '../models/config';
import { Data } from '../models/data';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

@Injectable()
export class PagedataService {

    GlobalData = {} as any;
    config = new Config();
    pagecounter = 0 as number;
    selectedlink: string;
    searchData: any[] = [];

    private data: any = {};
    private observable: Observable<any>;
    private sessionCacheService: any;
    private localStoragecacheService: any;
    private inMemoryStorageService: any;

    constructor(private http: Http, private _cacheService: CacheService) {
        this.inMemoryStorageService = this._cacheService.useStorage(CacheStoragesEnum.MEMORY);
        this.sessionCacheService = this._cacheService.useStorage(CacheStoragesEnum.SESSION_STORAGE);
        this.localStoragecacheService = this._cacheService.useStorage(CacheStoragesEnum.LOCAL_STORAGE);
    };

    // Search Filter
    getsearchData(searchText: string, typeId: number): any {
        const url = this.config.Searchurl + '/' + searchText + '/' + typeId;
        return this.http
            .get(url)
            .map((response: Response) => response.json() as any[])
            .do(data => console.log(data))
            .catch(this.handleError);
    }

    getCMSDatafromServeByPageID(pageName: string, isHeader: boolean): any {
        const url = this.config.apiURl + '/' + pageName + '/' + isHeader;
        return this.observable = this.http
            .get(url)
            .map(response => {
                // when the cached data is available we don't need the `Observable` reference anymore
                this.observable = null;
                if (response.status === 400) {
                    return 'FAILURE';
                } else if (response.status === 200) {
                    const result = response.json() as any;
                    this.data.GlobalData = result.g;
                    this.data.pagespecificData = result.s;
                    this.data.PageName = pageName;
                    return this.data;
                }
                // make it shared so more than one subscriber can get the result
            })
            .share()
            .do(data => {
                return this.observable;
            })
            .catch(this.handleError);
    }

    // Get CMS Data
    getData(pageName: string): any {
        const isGlobalDataexisists: boolean = this.localStoragecacheService.exists('global');
        const isHeader: boolean = isGlobalDataexisists === true ? false : true;
        if (this.data) {
            if (this.data.PageName === pageName) {
                if (this.data.pagespecificData.isCacheble) {
                    return Observable.of(this.data);
                } else {
                    this.requestServerData(pageName, isHeader);
                    return Observable.of(this.data);
                }
            } else {
                this.getDataFromCacheService(pageName, isHeader);
                return Observable.of(this.data);
            }
        } else if (this.observable) {
            // if `this.observable` is set then the request is in progress
            // return the `Observable` for the ongoing request
            return this.observable;
        } else {
            this.getDataFromCacheService(pageName, isHeader);
            return Observable.of(this.data);
        }
    }



    private requestServerData(pageName: string, isHeader: boolean) {
        this.getCMSDatafromServeByPageID(pageName, isHeader)
            .subscribe((data) => {
                this.data = data;
                this.localStoragecacheService.set('global', this.data.GlobalData);
                if (this.data.pagespecificData.isCacheble) {
                    this.setInMemoryData(pageName);
                    this.setSessionMemorydata(pageName);
                    this.setLocalStorageData(pageName);

                } else {
                    const exists: boolean = this.localStoragecacheService.exists(pageName);
                    if (exists) {
                        this.localStoragecacheService.remove(pageName);
                    }
                }
            });
    }

    private setInMemoryData(pageName: string) {
        this.inMemoryStorageService.set(pageName, this.data.pagespecificData);
    }

    private setSessionMemorydata(pageName: string) {
        this.sessionCacheService.set(pageName, this.data.pagespecificData);
    }

    private setLocalStorageData(pageName: string) {
        this.localStoragecacheService.set(pageName, this.data.pagespecificData);
    }

    private getDataFromCacheService(pageName: string, isHeader: boolean) {
        const storagedata: any = {};
        storagedata.GlobalData = this.localStoragecacheService.get('global');
        if (this.inMemoryStorageService.exists(pageName)) {
            storagedata.pagespecificData = this.inMemoryStorageService.get(pageName);
            storagedata.PageName = pageName;
            this.data = storagedata;
            return;
        } else if (this.sessionCacheService.exists(pageName)) {
            storagedata.pagespecificData = this.sessionCacheService.get(pageName);
            storagedata.PageName = pageName;
            this.data = storagedata;
            this.setInMemoryData(pageName);
            return;
        } else if (this.localStoragecacheService.exists(pageName)) {
            storagedata.pagespecificData = this.localStoragecacheService.get(pageName);
            storagedata.PageName = pageName;
            this.data = storagedata;
            this.setSessionMemorydata(pageName);
            return;
        } else {
            this.requestServerData(pageName, isHeader);
        }
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
