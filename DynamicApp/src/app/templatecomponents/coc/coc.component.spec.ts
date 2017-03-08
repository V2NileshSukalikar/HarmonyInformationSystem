import { TestBed, inject } from '@angular/core/testing';

import { CocComponent } from './coc.component';

describe('a coc component', () => {
	let component: CocComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CocComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([CocComponent], (CocComponent) => {
		component = CocComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});