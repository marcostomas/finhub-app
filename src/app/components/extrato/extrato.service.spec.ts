/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExtratoService } from './extrato.service';

describe('Service: Extrato', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtratoService]
    });
  });

  it('should ...', inject([ExtratoService], (service: ExtratoService) => {
    expect(service).toBeTruthy();
  }));
});
