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
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LazyImageComponent } from './components/lazy-image/lazy-image.component';
import { ServicesComponent } from './components/services/services.component';
import { StudentRegisterComponent } from './components/student-register/student-register.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { AdminStudentsComponent } from './components/admin-students/admin-students.component';
import { TimerComponent } from './components/timer/timer.component';
import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { McqTestComponent } from './components/mcq-test/mcq-test.component';
import { MachineTestComponent } from './components/machine-test/machine-test.component';
import { MockInterviewComponent } from './components/mock-interview/mock-interview.component';
import { AdminAssessmentsComponent } from './components/admin-assessments/admin-assessments.component';
import { AdminAssessmentDetailComponent } from './components/admin-assessment-detail/admin-assessment-detail.component';
import { AttendanceTrackerComponent } from './components/attendance-tracker/attendance-tracker.component';
import { StudentProgressComponent } from './components/student-progress/student-progress.component';
import { CameraGateComponent } from './components/camera-gate/camera-gate.component';
import { CameraMonitorComponent } from './components/camera-monitor/camera-monitor.component';
import { FloatingWidgetsComponent } from './components/floating-widgets/floating-widgets.component';
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';
import { CounterDirective } from './directives/counter.directive';
import { BlogComponent } from './components/blog/blog.component';

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
    ProjectManagementComponent,
    HeroSectionComponent,
    LazyImageComponent,
    ServicesComponent,
    StudentRegisterComponent,
    StudentLoginComponent,
    StudentDashboardComponent,
    AdminStudentsComponent,
    TimerComponent,
    AssessmentListComponent,
    McqTestComponent,
    MachineTestComponent,
    MockInterviewComponent,
    AdminAssessmentsComponent,
    AdminAssessmentDetailComponent,
    AttendanceTrackerComponent,
    StudentProgressComponent,
    CameraGateComponent,
    CameraMonitorComponent,
    FloatingWidgetsComponent,
    ScrollRevealDirective,
    CounterDirective,
    BlogComponent
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
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
