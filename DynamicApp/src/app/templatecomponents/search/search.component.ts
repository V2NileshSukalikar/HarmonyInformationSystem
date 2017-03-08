import { Component, OnInit, Input } from '@angular/core';
import { PagedataService } from '../../services/pagedata.service';
// declare var $: JQueryStatic;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() SearchNo: number = 0;
  quickSearchtext:string="";

  constructor(private pagedataService: PagedataService, ) { }

  ngOnInit() {
  }

  searchDatabyString(searchText: string): void {
    this.pagedataService.searchData = [];

    this.pagedataService.getsearchData(searchText).then(
      session =>
        setTimeout(() => {
          this.pagedataService.searchData = session.data;
          // var WH = $(window).height();
          // var SH = $('body').prop("scrollHeight")+500;
          // $('html, body').stop().animate({ scrollTop: SH - WH }, 1000);
        }, 500)
    );
  }


}