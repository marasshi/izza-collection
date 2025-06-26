import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  sendOrderAcceptedEmail(email: string, name: string, orderId: string): Promise<void> {
    // TODO: Implement actual email sending logic here (e.g., via a backend API or third-party service)
    console.log(`Sending order accepted email to ${email} for order ${orderId}`);
    return Promise.resolve();
  }
}
