import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {ModalController, MenuController, ToastController} from '@ionic/angular';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { Verivikasi } from '../verivikasi/verivikasi.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { PasswordValidator } from '../validators/password.validator';
import {Users} from '../services/sqlite/users/users';
import {ApiService} from '../services/users/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './styles/signup.page.scss'
  ]
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  matching_passwords_group: FormGroup;
  data: Users;
  cek: any;
  colorpesan: any;

  validation_messages = {
    'full_name': [
      { type: 'required', message: 'Full Name is required.' },
      { type: 'minlength', message: 'Full Name must be at least 6 characters long.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };
  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    public apiService: ApiService,
    private toastCtrl: ToastController,

  ) {
    this.data = new Users();
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.signupForm = new FormGroup({
      'email': new FormControl('test@test.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'full_name': new FormControl('Rewards Saja', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])),
      'matching_passwords': this.matching_passwords_group
    });
  }

  ngOnInit(): void {
    this.router.navigated = true;
    this.menu.enable(false);
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServicePage
    });
    return await modal.present();
  }

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage
    });
    return await modal.present();
  }
  async presentToast(res) {
    this.cek = res.success;
    if (this.cek === false) {
      this.colorpesan = 'warning';
    } else {
      this.colorpesan = 'success';

      }
    const toast = await this.toastCtrl.create({
      message: res.result.message,
      color: this.colorpesan,
      mode: 'ios',
      duration: 5000,
      showCloseButton: true,
    });
    toast.present();
    if (this.cek === true) {
      const modal = await this.modalController.create({
        component: Verivikasi,
        componentProps: { datacenter: this.data }
      });
      return await modal.present();
    }
  }
  doSignup(): void {
    // const modal = await this.modalController.create({
    //   component: Verivikasi,
    //   componentProps: { datacenter: this.data }
    //
    // });
    // return await modal.present();
    // console.log('do sign up');
    this.apiService.Register(this.data).subscribe(
        res => this.presentToast(res),
        err => console.log('HTTP Error', err),
    );
  }
}
