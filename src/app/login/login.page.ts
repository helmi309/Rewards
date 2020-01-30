import {Component, OnInit} from '@angular/core';
import {Users} from '../models/users';
import {ApiService} from '../services/users/api.service';

import {Validators, FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuController, ToastController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: [
        './styles/login.page.scss'
    ]
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    data: Users;
    userData: any;

    validation_messages = {
        'email': [
            {type: 'required', message: 'Email is required.'},
            {type: 'pattern', message: 'Enter a valid email.'}
        ],
        'password': [
            {type: 'required', message: 'Password is required.'},
            {type: 'minlength', message: 'Password must be at least 6 characters long.'}
        ]
    };

    constructor(
        public apiService: ApiService,
        public router: Router,
        public menu: MenuController,
        private toastCtrl: ToastController,
        private fb: Facebook,

    ) {
        this.data = new Users();
        this.loginForm = new FormGroup({
            'email': new FormControl('test@test.com', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            'password': new FormControl('', Validators.compose([
                Validators.minLength(6),
                Validators.required
            ]))
        });
    }

    ngOnInit(): void {
        this.menu.enable(false);
    }

    async presentToast(res) {
        const toast = await this.toastCtrl.create({
            message: res.result.message,
            color: 'warning',
            mode: 'ios',
            duration: 5000,
            showCloseButton: true,
        });
        toast.present();
    }

    doLogin(): void {
        this.apiService.Login(this.data).subscribe(
            res => this.presentToast(res),
            err => console.log('HTTP Error', err),
        );
        console.log('do Log In');
        // this.router.navigate(['app/categories']);
    }

    goToForgotPassword(): void {
        console.log('redirect to forgot-password page');
    }

    doFacebookLogin(): void {
        this.fb.getLoginStatus().then((res) => {
            if (res.status !== 'connected') {
                // Not already logged in to FB so sign in
                this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
                    this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
                        this.userData = {
                            email: profile['email'],
                            first_name: profile['first_name'],
                            picture: profile['picture_large']['data']['url'],
                            username: profile['name']
                        }
                    });
                }).catch((error) => {
                    console.log(error);

                    // FB Log in error
                });
            }
        });


        this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }

    doGoogleLogin(): void {
        console.log('google login');
        this.router.navigate(['app/categories']);
    }

    doTwitterLogin(): void {
        console.log('twitter login');
        this.router.navigate(['app/categories']);
    }
}
