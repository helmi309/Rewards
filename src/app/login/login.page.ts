import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/users/api.service';
import {UsersService} from './../services/sqlite/users/users.service';

import {Validators, FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MenuController, ToastController} from '@ionic/angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Users} from '../services/sqlite/users/users';


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
    colorpesan: any;
    cek: any;
    users: any;
    UserField: Users;

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
        private UsersDatas: UsersService,
        private googlePlus: GooglePlus
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
        this.cek = res.success;
        if (this.cek === false) {
            this.colorpesan = 'warning';
        } else {
            this.users = await this.UsersDatas.getByUserId(res.result.users.id);
            if (this.users) {
                this.UserField = {
                    id: 0,
                    name: res.result.users.name,
                    email: res.result.users.email,
                    userId: res.result.users.id,
                    role: res.result.users.level,
                    image: res.result.users.user_by,
                    isCode: res.result.users.is_aktif,
                };
                this.UsersDatas.insert(this.UserField);
                this.router.navigated = false;
                this.router.navigate(['app/categories']);
            }
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

    doLogin(): void {
        this.apiService.Login(this.data).subscribe(
            res => this.presentToast(res),
            err => console.log('HTTP Error', err),
        );

    }

    goToForgotPassword(): void {
        console.log('redirect to forgot-password page');
    }

    doFacebookLogin(): void {
        this.fb.getLoginStatus().then((data) => {
                if (data.status === 'connected') {
                    this.fb.logout();
                }
            }
        );
        this.fb.getLoginStatus().then((res) => {
            if (res.status !== 'connected') {
                // Not already logged in to FB so sign in
                this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
                    this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
                        this.UserField = {
                            id: profile['id'],
                            name: profile['first_name'],
                            email: profile['email'],
                            userId: '',
                            role: '2',
                            image: profile['picture_large']['data']['url'],
                            isCode: '0',
                        };
                        this.Createdatausers();
                    });
                }).catch((error) => {
                    console.log(error);

                    // FB Log in error
                });
            } else {
                this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
                    console.log(profile['email']);
                });
            }
        });
        this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }

    async Createdatausers() {
        this.apiService.CreateDataMediaSosial(this.UserField).subscribe(
            res2 => this.CreateSqlite(res2),
             err => console.log('HTTP Error', err),
        );
    }
    async CreateSqlite(res2) {
        this.UserField = {
            id: 0,
            name: res2['result'].users.name,
            email: res2['result'].users.email,
            userId: res2['result'].users.id,
            role: res2['result'].users.level,
            image: res2['result'].users.user_by,
            isCode: res2['result'].users.is_aktif,
        }

        this.UsersDatas.insert(this.UserField);
        const toast2 = await this.toastCtrl.create({
            message: 'Login Berhasil',
            color: 'success',
            mode: 'ios',
            duration: 5000,
            showCloseButton: true,
        });

        toast2.present();
        this.router.navigate(['app/categories']);
    }
    doGoogleLogin(): void {
        console.log('google login');
        // this.router.navigate(['app/categories']);
        this.googlePlus.login({})
            .then(res => this.creategoogle(res))
            .catch(err => console.error(err));
    }
    async creategoogle(profile) {
        this.UserField = {
            id: profile['userId'],
            name: profile['displayName'],
            email: profile['email'],
            userId: '',
            role: '3',
            image: profile['imageUrl'],
            isCode: '0',
        };
        this.Createdatausers();
    }

    doTwitterLogin(): void {
        console.log('twitter login');
        this.router.navigate(['app/categories']);
    }
}
