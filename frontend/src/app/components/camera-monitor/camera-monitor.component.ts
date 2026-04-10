import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera-monitor',
  templateUrl: './camera-monitor.component.html',
  styleUrls: ['./camera-monitor.component.css']
})
export class CameraMonitorComponent implements AfterViewInit, OnDestroy {

  @ViewChild('camFeed') camFeedRef!: ElementRef<HTMLVideoElement>;
  minimized = false;

  constructor(private cameraService: CameraService) {}

  ngAfterViewInit(): void {
    const stream = this.cameraService.getStream();
    if (stream && this.camFeedRef?.nativeElement) {
      this.camFeedRef.nativeElement.srcObject = stream;
    }
  }

  ngOnDestroy(): void {}

  toggle(): void {
    this.minimized = !this.minimized;
  }
}
