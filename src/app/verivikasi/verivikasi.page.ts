import { Component } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Users} from '../services/sqlite/users/users';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-verivikasi-page',
  templateUrl: 'verivikasi.page.html',
  styleUrls: [
    './styles/terms-of-service.page.scss'
  ]
})

export class Verivikasi {

  data: Users;
  datacenter: any;
  verivikasi: FormGroup;
  validation_messages = {
    'code': [
      { type: 'required', message: 'Code is required.' },
      { type: 'minlength', message: 'Code must be at least 6 characters long.' }
    ],
  };
  constructor(private modalController: ModalController, private navParams: NavParams ) {
    this.data = new Users();
    this.datacenter = this.navParams.get('datacenter');
    this.verivikasi = new FormGroup({
      'code': new FormControl('Code', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])),
    });
  }

  ionViewWillEnter() {
    console.log(this.datacenter);
  }

  // datacenter
  dismiss(): void {
    this.modalController.dismiss();
  }
  async doSignup() {
    // const modal = await this.modalController.create({
    //   component: Verivikasi
    // });
    // return await modal.present();
    console.log('do sign up');
    // this.apiService.Register(this.data).subscribe(
    //     res => this.presentToast(res),
    //     err => console.log('HTTP Error', err),
    // );
  }
}
