import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

import { AddressService } from '../services/address.service';
import { AlertsService } from '../services/alerts.service';
import { Address } from '../models/address';
import { cepRegex, cepMask } from '../utils/form-utils';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  form!: FormGroup;

  cepMask = cepMask;

  previousCep!: string;

  CEP_LENGTH = 8;
  DEBOUNCE_TIME = 1000;

  constructor(
    private fb: FormBuilder,
    private enderecoService: AddressService,
    private alertsService: AlertsService
  ) {
    this.form = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern(cepRegex)]],
      logradouro: ['', Validators.required],
      complemento: ['', Validators.required],
      bairro: [''],
      localidade: [''],
      uf: [''],
      ibge: [''],
      gia: [''],
      ddd: [''],
      siafi: [''],
    });
  }

  ngOnInit(): void {
    this.loadCep();

    this.getCepWhenChangeAndfillValue();
  }

  loadCep() {
    const savedAddress = localStorage.getItem('address');

    if (savedAddress) {
      this.popularDados(JSON.parse(savedAddress));
    } else {
      const INITIAL_VALUE_CEP = '30160-907';
      this.searchAddressByCep(INITIAL_VALUE_CEP);
    }
  }

  getCepWhenChangeAndfillValue() {
    this.form
      .get('cep')
      ?.valueChanges.pipe(
        debounceTime(this.DEBOUNCE_TIME),
        tap((cep) => {
          if (this.cepValidation(cep)) {
            this.previousCep = cep;
            this.searchAddressByCep(cep);
          }
        })
      )
      .subscribe();
  }

  cepValidation(cepValue: string): boolean {
    if (!cepValue) {
      return false;
    }

    const cep = this.removeSymbolsOfCep(cepValue);
    const previousCepFormat = this.removeSymbolsOfCep(this.previousCep);

    return cep.length === this.CEP_LENGTH && cep !== previousCepFormat;
  }

  removeSymbolsOfCep(cep: string): string {
    if (!cep) return;
    return cep.replace('-', '').replace('_', '');
  }

  saveChanges() {
    if (this.form.valid) {
      localStorage.setItem('address', JSON.stringify(this.form.value));

      this.alertsService.success({
        title: ``,
        text: 'Endereço salvo com Sucesso!',
        confirmButtonText: 'Fechar',
      });
    }
  }

  searchAddressByCep(cepValue: string) {
    const cep = this.removeSymbolsOfCep(cepValue);
    this.enderecoService.getAddress(cep).subscribe({
      next: (data: Address | any) => {
        if (data?.erro) {
          this.form.get('cep')?.setErrors({ invalid: true });
          this.alertsService.error({
            title: ``,
            text: 'CEP inválido ou não encontrado!',
            confirmButtonText: 'Fechar',
          });
          this.form.reset();
          localStorage.removeItem('address');
        } else {
          this.popularDados(data);
        }
      },
      error: (error) => {
        this.form.get('cep')?.setErrors({ invalid: true });
        this.alertsService.error({
          title: ``,
          text: 'Endereço salvo com Sucesso!',
          confirmButtonText: 'Fechar',
        });
      },
    });
  }

  popularDados(data: Address) {
    this.form.patchValue({
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      cep: data.cep,
      gia: data.gia,
      ddd: data.ddd,
      siafi: data.siafi,
    });
    this.form.get('ibge')?.disable();
    this.form.get('siafi')?.disable();
  }
}
