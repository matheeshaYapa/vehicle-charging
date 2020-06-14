import { Injectable } from '@angular/core';
import {CsvData} from "../app/models/csv-data";

@Injectable({
  providedIn: 'root'
})
export class CsvReaderService {

  isFilePicked = false;
  isFileValid = false;
  fileData: CsvData[] = [];
  fileName = '';


  constructor() { }
}
