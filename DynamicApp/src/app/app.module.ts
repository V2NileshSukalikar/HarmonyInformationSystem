import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SpinnerModule } from 'angular2-spinner/dist';
import { BlockUIModule } from 'ng-block-ui';
import { CacheService } from 'ng2-cache/ng2-cache';

import { AppComponent } from './app.component';
import { HtmlComponent, SafeHtmlPipe } from './templatecomponents/html/html.component';
import { CocComponent } from './templatecomponents/coc/coc.component';
import { SearchComponent } from './templatecomponents/search/search.component';
import { PageComponent } from './page/page.component';

import { PagedataService } from './services/pagedata.service';

import { AppRoutingModule } from './routingmodule';



@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    HtmlComponent,
    CocComponent,
    SearchComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SpinnerModule,
    BlockUIModule
  ],

  providers: [PagedataService, CacheService],
  bootstrap: [AppComponent]
})
export class AppModule { }
