import {
  ElementRef,
  HostBinding,
  Injectable,
  Input,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Injectable()
export abstract class BaseFieldComponent<T> implements ControlValueAccessor {
  @Input() required = false;
  @Input() id!: string;
  @Input() type = 'text';
  @Input() isReadOnly = false;
  @Input() mask: any = [];
  @Input() label: string = '';
  @Input() control: any;

  @Input()
  col: number = 3;
  @HostBinding('class')
  className!: string;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.className = `col-${this.col}`;
    this.renderer.addClass(this.el.nativeElement, `col-${this.col}`);
  }

  private innerValue: any;

  get value(): T {
    return this.innerValue;
  }

  set value(v: T) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  get errorMessage() {
    if (this.control && this.control.errors) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName)) {
          return this.getErrorMsg(
            this.label,
            propertyName,
            this.control.errors[propertyName]
          );
        }
      }
    }
    return null;
  }

  getErrorMsg(
    fieldName: string,
    validatorName: string,
    validatorValue?: any
  ): any {
    const config: any = {
      required: `${fieldName} é obrigatório.`,
      minlength: `${fieldName} precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      maxlength: `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracteres.`,
      emailInvalido: 'Email já cadastrado!',
      equalsTo: 'Campos não são iguais',
      pattern: 'Campo inválido',
    };

    return config[validatorName];
  }

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: (_: any) => void = () => {};

  writeValue(v: T): void {
    this.value = v;
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }
}

export function MakeProvider<T>(type: T) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true,
  };
}
