import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PackagingLine} from '../../models/PackagingLine';
import {API_BASE_URL} from '../../config/constants';

@Injectable({
  providedIn: 'root'
})
export class PackagingLineService {

  constructor(private http: HttpClient) {
  }

  getAllPackagingLines(screenId: Number): Observable<PackagingLine[]> {
    const URL = `GetShippingForecastPackagingLine?screenId=${screenId}`;
    return this.http.post<PackagingLine[]>(API_BASE_URL + URL, null);
  }
}
