import { Injectable } from '@angular/core';

export type CameraStatus = 'pending' | 'granted' | 'denied' | 'unavailable';

@Injectable({ providedIn: 'root' })
export class CameraService {

  private stream: MediaStream | null = null;

  async requestCamera(): Promise<CameraStatus> {
    if (!navigator.mediaDevices?.getUserMedia) {
      return 'unavailable';
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      return 'granted';
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        return 'denied';
      }
      return 'unavailable';
    }
  }

  /** Stop the camera stream (call on component destroy) */
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  getStream(): MediaStream | null {
    return this.stream;
  }
}
