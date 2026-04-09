import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() totalMinutes: number = 0;
  @Output() timerExpired = new EventEmitter<void>();

  displayTime: string = '00:00';
  private remainingSeconds: number = 0;
  private intervalId: any = null;

  ngOnInit(): void {
    this.remainingSeconds = this.totalMinutes * 60;
    this.updateDisplay();
    this.intervalId = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplay();
      if (this.remainingSeconds <= 0) {
        this.clearInterval();
        this.timerExpired.emit();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateDisplay(): void {
    const seconds = Math.max(0, this.remainingSeconds);
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    this.displayTime = `${mm}:${ss}`;
  }
}
