import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';

type Step = 0 | 1 | 2 | 3;
type FormState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css'],
})
export class QuoteFormComponent {
  step: Step = 0;
  formState: FormState = 'idle';
  errorMessage = '';

  readonly currentYear = new Date().getFullYear();
  readonly minDate = new Date().toISOString().split('T')[0];
  readonly defaultDate = (() => {
    const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split('T')[0];
  })();

  readonly vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Other'];
  readonly contactPrefs = ['Email', 'Phone call', 'Text'];

  form: FormGroup;

  constructor(private fb: FormBuilder, private quoteService: QuoteService) {
    this.form = this.fb.group({
      // Step 0 — Vehicle
      vehicleYear: ['', [Validators.required]],
      vehicleMake: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      vehicleCondition: ['', [Validators.required]],
      vehicleMileage: [''],
      vin: [''],
      // Step 1 — Shipping
      pickupLocation: ['', [Validators.required]],
      dropOffLocation: ['', [Validators.required]],
      shipDate: [this.defaultDate, [Validators.required]],
      flexibility: ['Flexible', [Validators.required]],
      trailerType: ['', [Validators.required]],
      // Step 2 — Contact
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,20}$/)]],
      contactPref: ['Email'],
    });
  }

  // Chip/opt-card setters
  set(field: string, value: string) {
    this.form.get(field)!.setValue(value);
    this.form.get(field)!.markAsTouched();
  }

  is(field: string, value: string) {
    return this.form.get(field)!.value === value;
  }

  isInvalid(field: string) {
    const c = this.form.get(field)!;
    return c.invalid && c.touched;
  }

  get years(): number[] {
    const out: number[] = [];
    for (let y = this.currentYear + 1; y >= 1960; y--) out.push(y);
    return out;
  }

  readonly stepFields: string[][] = [
    ['vehicleYear', 'vehicleMake', 'vehicleModel', 'vehicleType', 'vehicleCondition'],
    ['pickupLocation', 'dropOffLocation', 'shipDate', 'trailerType'],
    ['firstName', 'lastName', 'email', 'phone'],
  ];

  next() {
    const fields = this.stepFields[this.step as 0 | 1 | 2];
    fields.forEach(f => this.form.get(f)!.markAsTouched());
    const valid = fields.every(f => this.form.get(f)!.valid);
    if (!valid) return;

    if (this.step === 2) {
      this.submit();
    } else {
      this.step = (this.step + 1) as Step;
    }
  }

  back() {
    if (this.step > 0) this.step = (this.step - 1) as Step;
  }

  submit() {
    this.step = 3;
    this.formState = 'submitting';

    this.quoteService.submitQuote(this.form.value).subscribe({
      next: () => { this.formState = 'success'; },
      error: (err) => {
        this.formState = 'error';
        this.errorMessage = err?.error?.error ?? 'Something went wrong. Please try again.';
      },
    });
  }

  reset() {
    this.form.reset({ shipDate: this.defaultDate, flexibility: 'Flexible', contactPref: 'Email' });
    this.step = 0;
    this.formState = 'idle';
  }
}
