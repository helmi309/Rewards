import {DatabaseService} from './services/config/database.service';
import {Component} from '@angular/core';
import {Plugins} from '@capacitor/core';
import { GlobalProvider } from './global-provider';

const {SplashScreen} = Plugins;
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {LoginAuthService} from './helper/login-auth.service';
import {UsersService} from './services/sqlite/users/users.service';
import {AlertController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: [
        './side-menu/styles/side-menu.scss',
        './side-menu/styles/side-menu.shell.scss',
        './side-menu/styles/side-menu.responsive.scss'
    ]
})
export class AppComponent {

    appPages = [
        {
            title: 'Categories',
            url: '/app/categories',
            icon: './assets/sample-icons/side-menu/categories.svg'
        },
        {
            title: 'Profile',
            url: '/app/user',
            icon: './assets/sample-icons/side-menu/profile.svg'
        },
        {
            title: 'Contact Card',
            url: '/contact-card',
            icon: './assets/sample-icons/side-menu/contact-card.svg'
        },
        {
            title: 'Notifications',
            url: '/app/notifications',
            icon: './assets/sample-icons/side-menu/notifications.svg'
        }
    ];
    accountPages = [
        {
            title: 'Log In',
            url: '/auth/login',
            icon: './assets/sample-icons/side-menu/login.svg'
        },
        {
            title: 'Sign Up',
            url: '/auth/signup',
            icon: './assets/sample-icons/side-menu/signup.svg'
        },
        {
            title: 'Tutorial',
            url: '/walkthrough',
            icon: './assets/sample-icons/side-menu/tutorial.svg'
        },
        {
            title: 'Getting Started',
            url: '/getting-started',
            icon: './assets/sample-icons/side-menu/getting-started.svg'
        },
        {
            title: '404 page',
            url: '/page-not-found',
            icon: './assets/sample-icons/side-menu/warning.svg'
        }
    ];
    textDir = 'ltr';
    constructor(public translate: TranslateService, private db: DatabaseService, private LoginCek: LoginAuthService, private usersService: UsersService, private alertCtrl: AlertController, private toastCtrl: ToastController, private router: Router, private fb: Facebook, private UsersDatas: UsersService, private ionicWindow: Platform, private googlePlus: GooglePlus, private platform: Platform, public global: GlobalProvider) {
        this.platform.ready().then(() => {
            this.initializeApp();
        });
        this.setLanguage();
        this.backbutton();

    }

    async backbutton() {
        if (this.router.navigated === false) {
            this.platform.backButton.subscribe(() => {
                console.log('halo');
                navigator['app'].exitApp();
            });
        }
    }

    async logout() {
        const alert = await this.alertCtrl.create({
            header: 'Delete?',
            message: `Apakah Anda ingin Keluar ?`,
            buttons: [
                {
                    text: 'Batal',
                    role: 'cancel'
                },
                {
                    text: 'Keluar',
                    handler: () => {
                        this.yakinkeluar();
                    }
                }
            ]
        });
        alert.present();
    }

    async yakinkeluar() {
        try {
            // Removendo do banco de dados
            await this.usersService.deleteAll();
            this.fb.logout();
            this.googlePlus.logout()
                .then(res => console.log(res))
                .catch(err => console.error(err));
            this.router.navigated = false;
            this.router.navigate(['auth/login']);
            const toast = await this.toastCtrl.create({
                header: 'Sukses',
                message: 'Berhasil Keluar.',
                color: 'success',
                position: 'bottom',
                duration: 3000
            });

            toast.present();
        } catch (error) {
            const toast = await this.toastCtrl.create({
                header: 'Error',
                message: 'Terjadi kesalahan saat mencoba keluar.',
                color: 'danger',
                position: 'bottom',
                duration: 3000
            });
            toast.present();
        }
    }

    async initializeApp() {
        try {
            await SplashScreen.hide();
            await this.db.openDatabase();
            await this.LoginCek.load().then(
                res => this.CekDataSession(res),
                err => console.log('HTTP Error', err),
            );
        } catch (err) {
            console.log('This is normal in a browser', err);
        }
    }
    async CekDataSession(res) {
        if (res.status === true) {
            this.global.datausers2 = {
                id: res.message[0].id,
                name: res.message[0].name,
                email: res.message[0].email,
                userId: res.message[0].userId,
                image: res.message[0].image,
                role: res.message[0].role,
                isCode: res.message[0].isCode,
            };
            console.log(this.global.datausers2);
        }
    }

    CloseApp() {
        navigator['app'].exitApp();
        // this.ionicWindow.exitApp();
    }

    setLanguage() {
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use('en');

        // this is to determine the text direction depending on the selected language
        // for the purpose of this example we determine that only arabic and hebrew are RTL.
        // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
        // });
    }

}
