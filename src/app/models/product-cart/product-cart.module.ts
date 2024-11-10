import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface ProductCart {
  itemId: number;
  name: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  size: string;
  color: string;
  image: string; 
  //image: Uint8Array; 
}
