import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable()
export class AlertsService {
  constructor() {}
  success({ title, text, confirmButtonText }: SweetAlertOptions) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText,
    });
  }

  error({ title, text, confirmButtonText }: SweetAlertOptions) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText,
    });
  }

  warning({ title, text, confirmButtonText }: SweetAlertOptions) {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText,
    });
  }

  info({ title, text, confirmButtonText }: SweetAlertOptions) {
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText,
    });
  }
}
