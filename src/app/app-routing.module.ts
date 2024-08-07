import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { AuthGuard } from './utils/auth.guard';
import { AuthRoutingModule } from './components/auth/auth-routing.module';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'auth', loadChildren: () => AuthRoutingModule },
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:id',
    component: CreatePostComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
