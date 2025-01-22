import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent {
  otpForm: FormGroup;
  isFormSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.maxLength(6)]]
    });
  }

  submitOtp() {
    
    this.isFormSubmitted = true;

    if (this.otpForm.valid) {
      const otpValue = this.otpForm.get('otp')?.value;
      console.log('OTP submitted:', otpValue);
      // Perform your OTP verification logic here
    } else {
      console.error('Invalid OTP form');
    }
  }
}
