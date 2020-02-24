import {Component} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {Users} from '../services/sqlite/users/users';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/users/api.service';
import {Router} from '@angular/router';

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
    cek: any;
    colorpesan: any;
    cekresetcode: any;
    validation_messages = {
        'code': [
            {type: 'required', message: 'Code is required.'},
            {type: 'minlength', message: 'Code must be at least 6 characters long.'}
        ],
    };
    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
        public apiService: ApiService,
        public router: Router,
        private toastCtrl: ToastController
    ) {
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
        this.cekresetcode = false;
        setTimeout(() => {
            this.cekresetcode = true;
        }, 6000);
        this.router.navigated = false;
        this.data.email = this.datacenter.email;
        this.data.name = this.datacenter.name;
      // console.log(this.data);
    }
    async showtoast(res) {
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
          this.modalController.dismiss();
          this.router.navigate(['auth/login']);
        }
    }
  async showtoastregister(res) {
    this.cek = res.success;
    if (this.cek === false) {
      this.colorpesan = 'warning';
    } else {
        // this.cekresetcode = false;
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
  }
    // datacenter
    dismiss(): void {
        this.modalController.dismiss();
    }
    RegisterSubmit(): void {
        this.apiService.ValidasiRegister(this.data).subscribe(
            res => this.showtoast(res),
            err => console.log('HTTP Error', err),
        );
    }
  ReloadCode(): void {
    this.apiService.ReloadCodeRegister(this.data).subscribe(
        res => this.showtoastregister(res),
        err => console.log('HTTP Error', err),
    );
  }
}
