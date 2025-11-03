import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Vlogs } from './components/vlogs/vlogs';
import { Contact } from './components/contact/contact';

const routes: Routes = [
 { path:'', redirectTo:'/home', pathMatch:'full' },
  { path:'home', component:Home},
  { path:'about', component:About },
  { path:'vlogs', component:Vlogs},
  { path:'contact', component:Contact }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
