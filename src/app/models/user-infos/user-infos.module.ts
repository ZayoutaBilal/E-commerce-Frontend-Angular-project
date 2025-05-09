import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class UserInfosModule {
  userId: number = 0 ;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  city: string;
  address: string;
  phone: string;
  birthday: Date;
  picture?: string;
  active: boolean = true;
  createdAt: Date = new Date();
  roles: string = '';

  constructor(
    username: string = '',
    email: string = '',
    firstName: string = '',
    lastName: string = '',
    gender: string = '',
    city: string = '',
    address: string = '',
    phone: string = '',
    birthday: Date = new Date(),
    picture?: string,
  
  ) {

    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.city = city;
    this.address = address;
    this.phone = phone;
    this.birthday = birthday;
    this.picture = picture;
    
  }
}
