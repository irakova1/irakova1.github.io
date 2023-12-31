import { Injectable, OnInit } from '@angular/core';

import { Trip } from '../model/Trip';
import {CurrentLocationService} from './location.service';
import { BehaviorSubject } from 'rxjs';
import {CityService} from "./city.service";
import {City} from "../model/City";


@Injectable()
export class TripService{

  private trip = new BehaviorSubject<any>({});
  selectedTrip$ = this.trip.asObservable();
  private trips = new BehaviorSubject<Trip[]>([]);
  tripList$ = this.trips.asObservable();

  constructor(private locationService: CurrentLocationService, private cityService: CityService) {
  }

  updateTripList(trip: Trip) {
    const currentArray = this.trips.getValue();
    const updatedArray = [...currentArray, trip];
    updatedArray.sort((a, b) => new Date(a.tripStartDate).getTime() - new Date(b.tripStartDate).getTime());
    this.trips.next(updatedArray);
  }

  updateSelectedTrip(trip: Trip) {
    this.trip.next(trip);
  }

}                                                                                                                                                                 // async getTripListOnInit():Promise<Trip[]>{
  //   let position: any;
  //   this.locationService.getCurrentLocation().then(res => console.log(res));
  //   let start = new Date();
  //   let end = new Date(start.getTime() + 15 * 24 * 60 * 60 * 1000);
  //   let trips = [new Trip( 1, 'Lviv', start, end)];
  //   return trips
  // }
