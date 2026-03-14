import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { InternshipComponent } from './components/internship/internship.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CourseManagementComponent } from './components/course-management/course-management.component';
import { InternshipManagementComponent } from './components/internship-management/internship-management.component';
import { AdminApplicationsComponent } from './components/admin-applications/admin-applications.component';
import { AdminEnrollmentsComponent } from './components/admin-enrollments/admin-enrollments.component';
import { AdminMessagesComponent } from './components/admin-messages/admin-messages.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LazyImageComponent } from './components/lazy-image/lazy-image.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    InternshipComponent,
    CoursesComponent,
    ProjectsComponent,
    ContactComponent,
    NavigationComponent,
    FooterComponent,
    LoginComponent,
    AdminDashboardComponent,
    CourseManagementComponent,
    InternshipManagementComponent,
    AdminApplicationsComponent,
    AdminEnrollmentsComponent,
    AdminMessagesComponent,
    HeroSectionComponent,
    LazyImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
