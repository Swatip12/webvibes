import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { InternshipComponent } from './components/internship/internship.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CourseManagementComponent } from './components/course-management/course-management.component';
import { InternshipManagementComponent } from './components/internship-management/internship-management.component';
import { AdminApplicationsComponent } from './components/admin-applications/admin-applications.component';
import { AdminEnrollmentsComponent } from './components/admin-enrollments/admin-enrollments.component';
import { AdminMessagesComponent } from './components/admin-messages/admin-messages.component';
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { ServicesComponent } from './components/services/services.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'internship', component: InternshipComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/courses', component: CourseManagementComponent, canActivate: [AuthGuard] },
  { path: 'admin/internships', component: InternshipManagementComponent, canActivate: [AuthGuard] },
  { path: 'admin/applications', component: AdminApplicationsComponent, canActivate: [AuthGuard] },
  { path: 'admin/enrollments', component: AdminEnrollmentsComponent, canActivate: [AuthGuard] },
  { path: 'admin/messages', component: AdminMessagesComponent, canActivate: [AuthGuard] },
  { path: 'admin/projects', component: ProjectManagementComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
