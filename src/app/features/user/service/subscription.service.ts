import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  registerSubscription(subscription: PushSubscription) {
    return this.http.post(`${api}/subscription/web`, {
      subscription,
    });
  }
}
