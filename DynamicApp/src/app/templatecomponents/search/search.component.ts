import { Component, OnInit, Input,style, state, animate, transition, trigger } from '@angular/core';
import { PagedataService } from '../../services/pagedata.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $: JQueryStatic;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
  trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity:0}),
      animate(500, style({opacity:1})) 
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
      animate(500, style({opacity:0})) 
    ])
  ])
]
})
export class SearchComponent implements OnInit {
@BlockUI() blockUI: NgBlockUI;
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
    this.blockUI.start('Loading...'); 
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
           this.blockUI.stop(); 

        }, 500)
    );
  }


}