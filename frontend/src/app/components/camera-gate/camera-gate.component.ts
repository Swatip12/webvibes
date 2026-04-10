import { Component, EventEmitter, OnDestroy, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CameraService, CameraStatus } from '../../services/camera.service';

@Component({
  selector: 'app-camera-gate',
  templateUrl: './camera-gate.component.html',
  styleUrls: ['./camera-gate.component.css']
})
export class CameraGateComponent implements AfterViewInit, OnDestroy {

  @Output() permitted = new EventEmitter<void>();
  @ViewChild('preview') previewRef!: ElementRef<HTMLVideoElement>;

  status: CameraStatus = 'pending';
  checking = false;

  constructor(private cameraService: CameraService) {}

  ngAfterViewInit(): void {
    this.requestAccess();
  }

  ngOnDestroy(): void {
    // Don't stop the stream here — the test component owns it until submit
  }

  async requestAccess(): Promise<void> {
    this.checking = true;
    this.status = 'pending';
    const result = await this.cameraService.requestCamera();
    this.status = result;
    this.checking = false;

    if (result === 'granted') {
      const stream = this.cameraService.getStream();
      if (stream && this.previewRef?.nativeElement) {
        this.previewRef.nativeElement.srcObject = stream;
      }
    }
  }

  proceed(): void {
    this.permitted.emit();
  }
}
