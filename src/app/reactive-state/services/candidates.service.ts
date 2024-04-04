import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { environment } from 'src/environments/environment';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class CandidatesService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _candidates$ = new BehaviorSubject<Candidate[]>([]);
  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  private lastCandidatesLoad = 0;

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getCandidatesFromServer() {
    if (Date.now() - this.lastCandidatesLoad <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http
      .get<Candidate[]>(`${environment.apiUrl}/candidates`)
      .pipe(
        delay(1000),
        tap((candidates) => {
          this.lastCandidatesLoad = Date.now();
          this.setLoadingStatus(false);
          this._candidates$.next(candidates);
        })
      )
      .subscribe();
  }
  getCandidateById(id: number): Observable<Candidate> {
    if (!this.lastCandidatesLoad) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      map(
        (candidates) => candidates.filter((candidate) => candidate.id === id)[0]
      )
    );
  }

  refuseCandidate(id: number): void {
    this.setLoadingStatus(true);
    this.http
      .delete(`${environment.apiUrl}/candidates/${id}`)
      .pipe(
        delay(1000),
        switchMap(() => this.candidates$),
        take(1),
        map((candidates) =>
          candidates.filter((candidate) => candidate.id !== id)
        ),
        tap((candidates) => {
          this._candidates$.next(candidates);
          this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  hireCandidate(id: number): void {
    this.candidates$
      .pipe(
        take(1),
        map((candidates) =>
          candidates.map((candidate) =>
            candidate.id === id
              ? { ...candidate, company: 'Snapface LTD' }
              : candidate
          )
        ),
        tap((updatesCandidates) => this._candidates$.next(updatesCandidates)),
        delay(1000),
        switchMap((updatesCandidates) =>
          this.http.patch(
            `${environment.apiUrl}/candidates/${id}`,
            updatesCandidates.find((candidate) => candidate.id === id)
          )
        )
      )
      .subscribe();
  }
}
