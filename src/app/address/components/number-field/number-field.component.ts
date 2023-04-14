import { Component, ElementRef, Renderer2, Input } from '@angular/core';
import {
  BaseFieldComponent,
  MakeProvider,
} from '../base-field/base-field.component';

type UserForm = {
  name: string;
};

@Component({
  selector: 'number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
  providers: [MakeProvider(NumberFieldComponent)],
})
export class NumberFieldComponent extends BaseFieldComponent<UserForm> {
  @Input() override required = false;
  @Input() override id!: string;
  @Input() override type = 'text';
  @Input() override isReadOnly = false;
  @Input() override mask: any = [];
  @Input() override control!: any;
  @Input() override label!: string;
  @Input()
  override col: number = 3;

  constructor(renderer: Renderer2, el: ElementRef) {
    super(renderer, el);
  }
}
