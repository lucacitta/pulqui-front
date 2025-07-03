import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _httpClient: HttpClient) {}

  getUserData() {
    const url = `${environment.URL_BACKEND_PUBLIC}/user/current`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._httpClient.get(url, { headers }).pipe(
      map((resp: any) => {
        if (resp && resp.person_id) {
          return { cons_persona: resp.person_id };
        } else {
          return {};
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error));
  }
}
