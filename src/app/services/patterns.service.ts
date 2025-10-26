import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

export interface Pattern {
  _id?: string;
  name: string;
  grid: boolean[][];
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PatternsService {
  private readonly baseUrl = `${environment.apiUrl}/patterns`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pattern[]> {
    return this.http.get<Pattern[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  create(pattern: Omit<Pattern, '_id' | 'createdAt'>): Observable<Pattern> {
    return this.http.post<Pattern>(this.baseUrl, pattern).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client/network error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
