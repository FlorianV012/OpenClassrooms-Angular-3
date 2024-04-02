import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { CandidatesService } from '../../services/candidates.service';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {
  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  constructor(private candidatesServices: CandidatesService) {}

  ngOnInit(): void {
    this.initObservables();
    this.candidatesServices.getCandidatesFromServer();
  }

  private initObservables() {
    this.loading$ = this.candidatesServices.loading$;
    this.candidates$ = this.candidatesServices.candidates$;
  }
}
