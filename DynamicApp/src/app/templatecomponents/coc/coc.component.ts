import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-coc',
	templateUrl: './coc.component.html',
	styleUrls: ['./coc.component.css']
})

export class CocComponent implements OnInit {

	@Input() CocData = {} as any;
	itemWidth: number = 0;
	constructor() { }

	ngOnInit() {
		this.itemWidth = Math.round(100 / this.CocData.Orientation)

	}
}
