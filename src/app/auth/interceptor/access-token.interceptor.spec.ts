import { TestBed } from '@angular/core/testing';

import { AccessTokenInterceptor } from './access-token.interceptor';

describe('AccessTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AccessTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AccessTokenInterceptor = TestBed.inject(AccessTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
