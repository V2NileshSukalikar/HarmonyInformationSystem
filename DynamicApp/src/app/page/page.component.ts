
import {
  Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone,
  OnChanges, ChangeDetectionStrategy, style, state, animate, transition, trigger
} from '@angular/core';
import { PagedataService } from '../services/pagedata.service';
import { ActivatedRoute, Params } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]

})
export class PageComponent implements AfterViewInit, OnInit {
  @BlockUI() blockUI: NgBlockUI;
  headerData: any = {};
  isHeader: boolean;
  widthofele: number[] = [];
  pagedataobj: any[] = [];


  constructor(private pagedataService: PagedataService, private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef, public zone: NgZone) {

    this.route.params
      .subscribe((params: Params) => {
        this.blockUI.start('Loading...');
        this.pagedata = {};
        this.data = {} as any;
        this.pagecounter = 0 as number;
        this.pagedataobj = [];
        this.pagedataService.searchData = [];
        this.pagedataService.selectedlink = '/page/' + params['token'];
        this.getpagedata(params['token']);
      });
  }
  ngOnInit() {
    this.pagecounter = 0;
  }

  ngAfterViewInit() {
    this.resertcounter();

    this.pagecounter = 0;

  }

  resertcounter() {

    this.pagecounter = 0;
  }

  setImage() {

    $('table Img').attr('src', 'https://wrcstaging.harmonyis.net/_layouts/images/square.gif')
  }

  pagedata: any = {};
  data = {} as any;
  pagecounter = 0 as number;

  getpagedata(name: string): void {
    let pagename = '';
    this.pagecounter = 0;
    this.data = {};
    pagename = name;
    this.pagedataService.getData(pagename).subscribe(
      (session) => {
        setTimeout(() => {
          this.pagedataService.pagecounter = 0;
          this.pagedata = session.pagespecificData;
          this.pagedataService.GlobalData = session.GlobalData;
          var content = this.pagedata.Data.length;
          var datacount = 0;
          if (this.pagedata.Data.length > this.pagedata.Orientation.length) {
            var count = this.pagedata.Data.length - this.pagedata.Orientation.length;
            for (var i = 0; i < count; i++) {

              this.pagedata.Orientation.push(this.pagedata.Orientation[this.pagedata.Orientation.length - 1]);

            }
          }


          for (var z = 0; z < this.pagedata.Orientation.length; z++) {
            if (this.pagedata.Orientation[z].Type == "Percentage") {
              var mainData = [];
              var margine = (0.4 * this.pagedata.Orientation[z].Order.length)
              var realwidth = 100 - margine;
              for (var h = 0; h < this.pagedata.Orientation[z].Order.length; h++) {
                if (this.pagedata.Data.length == datacount)
                  break;
                var calculatedwidth = (realwidth * this.pagedata.Orientation[z].Order[h]) / 100;
                var subdata = { class: "", width: calculatedwidth, Data: this.pagedata.Data[datacount] };
                mainData.push(subdata);
                datacount++;
              }

            }
            else if (this.pagedata.Orientation[z].Type == "Number") {
              var mainData = [];
              var colNo = parseInt(this.pagedata.Orientation[z].Order[0]);

              var colwidth = (100 - (0.4 * colNo)) / colNo;
              for (var h = 0; h < colNo; h++) {
                if (this.pagedata.Data.length == datacount)
                  break;

                var subdata1 = { class: "", width: colwidth, Data: this.pagedata.Data[datacount] };
                mainData.push(subdata1);
                datacount++;
              }
            }
            else if (this.pagedata.Orientation[z].Type == "Class") {
              var mainData = [];
              for (var h = 0; h < this.pagedata.Orientation[z].Order.length; h++) {
                if (this.pagedata.Data.length == datacount)
                  break;

                var subdata2 = { class: this.pagedata.Orientation[z].Order[h], width: "", Data: this.pagedata.Data[datacount] };
                mainData.push(subdata2);
                datacount++;
              }
            }


            this.pagedataobj.push(mainData);
            if (this.pagedata.Data.length == datacount)
              break;

          }
          console.log(this.pagedataobj);



          // this.pagedata.Orientation = this.pagedata.Orientation.split(',').map(function (item) {
          //   return parseInt(item, 10);
          // });
          // var orient = this.pagedata.Orientation.reduce((a, b) => a + b, 0);


          // if (content > orient) {
          //   var difference = content - orient;
          //   var lastdata = this.pagedata.Orientation[this.pagedata.Orientation.length - 1];
          //   var counter = 0;
          //   if (difference > lastdata) {
          //     counter = Math.ceil(difference / lastdata);
          //   }
          //   else if (difference > 0) {
          //     counter = 1;
          //   }

          //   for (var i = 0; i < counter; i++) {

          //     this.pagedata.Orientation.push(lastdata);
          //   }

          // }

          // var h = 0;
          // for (var i = 0; i < this.pagedata.Orientation.length; i++) {

          //   var contentdata = [];

          //   for (var z = 1; z <= this.pagedata.Orientation[i]; z++) {


          //     var data = 100 / this.pagedata.Orientation[i];
          //     this.widthofele.push(data);
          //     var subdata = { width: data, Data: this.pagedata.Data[h] };
          //     contentdata.push(subdata);
          //     h++;
          //     if (h == this.pagedata.Data.length) {
          //       break;
          //     }
          //   }


          //   this.pagedataobj.push(contentdata);
          //   if (h == this.pagedata.Data.length) {
          //     break;
          //   }

          // this.pagedata.Orientation.push(lastdata);
          //}

          console.log(this.pagedataobj);
          // this.cdRef.detectChanges();


          this.blockUI.stop();

        }
          , 100);
      }
    );



  }

  getclassRow(index: number): boolean {

    var data = 0;
    if (index == 0) {
      return true;
    }

    for (var i = (index - 1); i >= 0; i--) {
      if (i < (index - 1)) {

        if (this.widthofele[i] == this.widthofele[i + 1]) {
          data = this.widthofele[i] + data;
        }
      } else {
        data = this.widthofele[i] + data;

      }
      if (data > 95) {
        return true;
      }
    }

    return false;

  }

  incrementpagecounter() {
    if (this.pagedata != null && this.pagedataService.pagecounter < this.pagedata.Data.length) {
      this.pagedataService.pagecounter = this.pagedataService.pagecounter + 1;
    }
  }

  getclassfromOrientation(orient: number): number {
    var data = Math.round(100 / orient);
    return data;
  }

  getclassfromOrientation1(orient: number): number {


    //  var data  this.pagedata.Orientation
    var data = Math.round(100 / orient);
    return data;
  }

  isdataOver() {
    return !(this.pagedataService.pagecounter === this.pagedata.Data.length);
  }

  createRange(number): any {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }
}

