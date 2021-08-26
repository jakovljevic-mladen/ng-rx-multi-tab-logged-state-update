import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() open: boolean;
  @Output() openChange: EventEmitter<boolean>;

  get displayStyle() {
    return {
      display: this.open ? 'block' : 'none'
    };
  };

  constructor() {
    this.open = false;
    this.openChange = new EventEmitter<boolean>();
  }

  close() {
    this.open = false;
    this.openChange.emit(this.open);
  }
}
