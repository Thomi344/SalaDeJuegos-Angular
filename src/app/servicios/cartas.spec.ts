import { TestBed } from '@angular/core/testing';

import { Cartas } from './cartas';

describe('Cartas', () => {
  let service: Cartas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cartas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
