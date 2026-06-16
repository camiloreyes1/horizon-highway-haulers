import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuoteRequest } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly url = `${environment.apiUrl}/quote`;

  constructor(private http: HttpClient) {}

  submitQuote(data: QuoteRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.url, data);
  }
}
