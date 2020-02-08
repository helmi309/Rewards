import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { AuthGuardFalse } from './auth-guard-false.service';

const routes: Routes = [
  { path: '', redirectTo: '/walkthrough', pathMatch: 'full' },
  { path: 'walkthrough', canActivate: [AuthGuard] , loadChildren: () => import('./walkthrough/walkthrough.module').then(m => m.WalkthroughPageModule) },
  { path: 'getting-started',  canActivate: [AuthGuard] , loadChildren: () => import('./getting-started/getting-started.module').then(m => m.GettingStartedPageModule) },
  { path: 'auth/login', canActivate: [AuthGuard] , loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'auth/signup', canActivate: [AuthGuard],  loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule) },
  // tslint:disable-next-line:max-line-length
  { path: 'auth/forgot-password', canActivate: [AuthGuard], loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule) },
  { path: 'app', canActivate: [AuthGuardFalse] , loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'contact-card', canActivate: [AuthGuardFalse] , loadChildren: () => import('./contact-card/contact-card.module').then(m => m.ContactCardPageModule) },
  // tslint:disable-next-line:max-line-length
  { path: 'forms-and-validations', canActivate: [AuthGuardFalse] , loadChildren: () => import('./forms/validations/forms-validations.module').then(m => m.FormsValidationsPageModule) },
  { path: 'forms-filters', canActivate: [AuthGuardFalse] , loadChildren: () => import('./forms/filters/forms-filters.module').then(m => m.FormsFiltersPageModule) },
  { path: 'page-not-found', canActivate: [AuthGuardFalse] , loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
  { path: 'showcase', canActivate: [AuthGuardFalse] , loadChildren: () => import('./showcase/showcase.module').then(m => m.ShowcasePageModule) },
  { path: 'firebase', canActivate: [AuthGuardFalse] , loadChildren: () => import('./firebase/firebase-integration.module').then(m => m.FirebaseIntegrationModule) },
  { path: 'maps', canActivate: [AuthGuardFalse] ,   loadChildren: () => import('./maps/maps.module').then(m => m.MapsPageModule) },
  { path: 'video-playlist', canActivate: [AuthGuardFalse] , loadChildren: () => import('./video-playlist/video-playlist.module').then(m => m.VideoPlaylistPageModule) },
  { path: '**', redirectTo: 'page-not-found' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],  providers: [AuthGuard, AuthGuardFalse],
  exports: [RouterModule]
})
export class AppRoutingModule {}
