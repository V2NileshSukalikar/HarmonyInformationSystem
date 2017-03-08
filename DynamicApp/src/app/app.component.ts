import { Component, } from '@angular/core';
import { PagedataService } from './services/pagedata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'app works!';

  data = {} as any;
  constructor(private globalservice: PagedataService, private router: Router) {

    this.data = globalservice.GlobalData;
  }

  getdata() {
    this.data = this.globalservice.GlobalData;
  }

  setlink(url) {
    this.globalservice.selectedlink = url.join('/');
  }

  isDisabled(link) {

    return this.globalservice.selectedlink = link.join('/');
  }

}


