import { Component, OnInit, Input } from '@angular/core';
import { PagedataService } from '../../services/pagedata.service';
declare var $: JQueryStatic;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() SearchNo: number[] = [];
  indexno: number;
  quickSearchtext: string = "";
  searchData = [];
  selectedSearch: number = 0;
  alphabetarr: string[] = ["0-9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];

  constructor(private pagedataService: PagedataService, ) {

    this.getrandomumber();
  }

  ngOnInit() {
  }

  getrandomumber(): void {

    this.indexno = Math.floor(Math.random() * 1000);
  }

  searchDatabyString(searchText: string, index: number, selected: number): void {
    this.pagedataService.searchData = [];
    this.selectedSearch = selected;
    this.pagedataService.getsearchData(searchText, selected).subscribe(
      session =>
        setTimeout(() => {
          this.pagedataService.searchData = session.data;
          this.searchData = session.data;
          let element = document.getElementById('section-' + index);
          $("body, html").animate({
            scrollTop: $(element).offset().top
          }, 600);

        }, 500)
    );
  }


}