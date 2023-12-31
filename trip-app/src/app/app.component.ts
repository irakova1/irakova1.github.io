import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Trip } from './model/Trip';
import { TripService } from './services/trip.service';
import { DetailsComponent } from './components/details/details.component';
import { WeatherService } from './services/weather.service';
import { Weather } from './model/Weather';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { City } from './model/City';
import { UnsplashService } from './services/unsplash.service';
import {CityService} from "./services/city.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  tripList!: Trip[];
  selectedTrip!: Trip;
  searchCity!: string;
  dayList!: Weather[];
  todayCityWeather!: Weather;
  showPopup: boolean = false;
  currentIndex = 0;

  cityList = [
    { name: 'New York', country: 'US' },
    { name: 'London', country: 'UK' },
    { name: 'Paris', country: 'FR' },
    { name: 'Krakiw', country: 'PL' },
    { name: 'Kyiv', country: 'UA' },
    { name: 'Texas', country: 'US' },
    { name: 'Berlin', country: 'DE' },
    { name: 'Alicante', country: 'ES' }
    // Add more cities as needed
  ];

  constructor(private tripService : TripService,
              private cityService : CityService,
              private weatherService: WeatherService, private http:HttpClient, private datePipe: DatePipe, private unsplashService: UnsplashService) { }

  ngOnInit(){
    this.tripService.selectedTrip$.subscribe((value: Trip) => {
      this.selectedTrip = value;
    });
    this.tripService.tripList$.subscribe((value: Trip[]) => {
      this.tripList = value;
    });
   if (this.isObjectEmpty(this.tripList)){
    // this.cityList = this.cityService.getCityList();
    let today = new Date();
    let start = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    let end = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    for (const c of this.cityList){
      let defaultTrip = new Trip( 1, c?.name, c?.country, start, end);
      this.tripService.updateTripList(defaultTrip);

    }
    this.onSelectedTrip(this.tripList[0]);
   }
  }

  isObjectEmpty(obj:any){
    return (Object.keys(obj).length === 0)
  }

  onSelectedTrip(trip: Trip) {
    this.tripService.updateSelectedTrip(trip);
    this.weatherService.getTripWeather(this.selectedTrip).subscribe((weatherData) => {
      this.dayList = weatherData;
    });
    this.weatherService.getTodayTripCityWeather(this.selectedTrip.tripCity, this.selectedTrip.tripCountry).subscribe((weatherData: Weather) => {
      this.todayCityWeather = weatherData;
    });
  }

  onInputSearch(tripCity: string){
    this.searchCity = tripCity;
    this.currentIndex = 0;
  }

  onObjectCreated(newTrip: Trip) {
    console.log('Object created:', newTrip);
    this.tripService.updateTripList(newTrip);
    this.showPopup = false;
  }

  nextItem() {
    if (this.currentIndex < this.tripList.length - 1) {
      this.currentIndex+=3;
    }
  }
  
  previousItem() {
    if (this.currentIndex > 0) {
      this.currentIndex-=3;
    }
  }
  
  getFilteredTripList(): Trip[] {
    if (!this.tripList || !this.searchCity) {
      return this.tripList;
    }

    this.searchCity = this.searchCity.toLowerCase();
    return this.tripList.filter((city) =>
      city.tripCity?.toLowerCase().includes(this.searchCity)
    );
  }
}
