import { TestBed } from '@angular/core/testing';

import { EmailVerificarionGuard } from './email-verificarion.guard';

describe('EmailVerificarionGuard', () => {
  let guard: EmailVerificarionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmailVerificarionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
