import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getDailyReport(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}report/daily`, {
      withCredentials: true,
    });
  }
  public getWeeklyReport(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}report/weekly`, {
      withCredentials: true,
    });
  }
  public getDailyReportHistory(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}report/daily/all`, {
      withCredentials: true,
    });
  }
}
