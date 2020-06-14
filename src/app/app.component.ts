import {Component, ViewChild} from '@angular/core';
import {CsvReaderService} from "../services/csv-reader.service";
import {CsvData} from "./models/csv-data";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('filePicker', {static: false}) csvReader: any;

  displayedColumns: string[] = ['index', 'vehicle', 'charge', 'hours'];
  dataSource = new MatTableDataSource<CsvData>([]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  filePicked = false;
  fileName = '';

  isPopupOpened = false;

  constructor(public csvReaderService: CsvReaderService) { }

  ngOnInit() {
    // this.dataSource = this.csvReaderService.fileData;
    // this.filePicked = this.csvReaderService.isFilePicked;
  }

  onFilePicked(event: any) {
    console.log(event.srcElement.files.length > 0);
    const file = event.srcElement.files[0];
    if ((event.srcElement.files.length > 0) && this.isValidCSVFile(file)) {
      this.csvReaderService.isFileValid = true;
      this.filePicked = true;
      this.csvReaderService.isFilePicked = this.filePicked;
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        const fileData = fileReader.result;
        this.csvReaderService.fileName = file.name;
        const fileDataArray = (fileData as string).split(/\r\n|\n/);
        // console.log(fileDataArray);
        fileDataArray.splice(fileDataArray.length - 1, 1);
        this.dataSource.data = this.separateDataFromCsv(fileDataArray);
        this.dataSource.paginator = this.paginator;
        this.csvReaderService.fileData = this.dataSource.data;
        this.isPopupOpened = true;
      };
    } else {
      this.csvReaderService.isFileValid = false;
      this.fileReset();
      this.csvReaderService.fileName = '';
      this.csvReaderService.isFilePicked = false;
    }
  }

  separateDataFromCsv(dataArray: any) {
    const newArray: CsvData[] = [];
    const toDay = new Date();
    let endTime = new Date();
    for (const dataEl of dataArray) {
      const splitDataEl = dataEl.split(',', 3);
      if (splitDataEl[1] !== '') {
        const currentDate = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate(), 7, 0, 0, 0);
        const chargingTime = this.setChargingTime(splitDataEl[1]);
        endTime = new Date(currentDate.setHours(currentDate.getHours() - chargingTime));
        newArray.push({vehicle: splitDataEl[0], currentCharge: splitDataEl[1], hours: endTime});
      }
    }
    console.log(newArray);
    return newArray;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.csvReaderService.fileData = [];
  }

  setChargingTime(chargingRate: number) {
    switch (true) {
      case (chargingRate <= 10):
        return 10;
      case (chargingRate <= 20):
        return 9;
      case (chargingRate <= 30):
        return 8;
      case (chargingRate <= 40):
        return 7;
      case (chargingRate <= 50):
        return 6;
      case (chargingRate <= 60):
        return 5;
      case (chargingRate <= 70):
        return 4;
      case (chargingRate <= 80):
        return 3;
      case (chargingRate <= 90):
        return 2;
      case (chargingRate <= 100):
        return 1;
    }
  }

}
