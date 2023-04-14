import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import {
  BaseFieldComponent,
  MakeProvider,
} from '../base-field/base-field.component';

type UserForm = {
  name: string;
};

@Component({
  selector: 'form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  providers: [MakeProvider(FormFieldComponent)],
})
export class FormFieldComponent extends BaseFieldComponent<UserForm> {
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
