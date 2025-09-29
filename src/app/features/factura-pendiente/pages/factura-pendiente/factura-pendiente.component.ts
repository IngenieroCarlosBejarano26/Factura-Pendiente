import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NotificationService } from '../../../../core/services/notifications/notification.service';
import { ScreenInfoService } from '../../../../core/services/screen/screen-info.service';
import { dateRangeValidator } from '../../../../shared/validators/dateRangeValidator';
import { requiredDatesValidator } from '../../../../shared/validators/requiredDatesValidator';
import { ModalService } from '../../../../core/services/modals/modal.service';
import { requiredFieldsConditionalValidator } from '../../../../shared/validators/requiredFieldsConditionalValidator';

@Component({
  selector: 'app-factura-pendiente',
  imports: [
    NzIconModule,
    CommonModule,
    NzButtonModule,
    NzTableModule,
    NzTagModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
  ],
  templateUrl: './factura-pendiente.component.html',
  styleUrl: './factura-pendiente.component.css',
})
export class FacturaPendienteComponent {
  //#region VARIABLES
  pagesize: number = 4;
  @Input() tab: string = '';
  activeTabContent: string = '';
  btnprimaryText: string = '';
  btnDefaultText: string = '';
  searchGlobal = '';
  dataFiltered: any[] = [];
  listOfData: any[] = [];
  dataPending: any[] = [];
  columns: any = {
    numeroComprobante: {
      title: 'No. de Comprobante',
      sortOrder: 'ascend',
      sortFn: (a: any, b: any) =>
        a.numeroComprobante.localeCompare(b.numeroComprobante),
      sortDirections: ['ascend', 'descend', null],
    },
    numeroGuia: {
      title: 'No. de Guia',
      sortOrder: 'ascend',
      sortFn: (a: any, b: any) => a.numeroGuia.localeCompare(b.numeroGuia),
      sortDirections: ['ascend', 'descend', null],
    },
    identificacionCliente: {
      title: 'No. de Identificacion',
      sortOrder: 'ascend',
      sortFn: (a: any, b: any) => a.numeroGuia.localeCompare(b.numeroGuia),
      sortDirections: ['ascend', 'descend', null],
    },
    nombreCliente: {
      title: 'Nombre del Cliente',
      sortOrder: 'ascend',
      sortFn: (a: any, b: any) => a.numeroGuia.localeCompare(b.numeroGuia),
      sortDirections: ['ascend', 'descend', null],
    },
    estado: {
      title: 'Estado',
      sortOrder: 'ascend',
      sortFn: (a: any, b: any) => a.estado.localeCompare(b.estado),
      sortDirections: ['ascend', 'descend', null],
    },
  };
  invoiceForm!: FormGroup;
  checked: boolean = false;
  setOfCheckedId = new Set<number>();
  screenHeight: number;
  height: number = 1024;
  today = new Date();
  minDate = new Date(2025, 3, 1);

  //#endregion

  constructor(
    private fb: NonNullableFormBuilder,
    private notification: NotificationService,
    private screenInfoService: ScreenInfoService,
    private modalService: ModalService
  ) {
    this.setup();
    this.screenHeight = this.screenInfoService.getScreenHeight();

    if (this.screenHeight >= this.height) {
      this.pagesize = 11;
    }
  }

  // ngOnInit(): void {
  //   this.loadDataPending();
  //   this.inicializarTab();
  //   this.loadData();
  // }

  get isFormInvalid() {
    return this.invoiceForm.invalid;
  }
  //#region Metodos Publicos

  filterTable(): void {
    const keyword = this.searchGlobal.toLowerCase().trim();
    this.dataFiltered = this.listOfData.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(keyword)
      )
    );
  }

  applyFilter(valores: string[], campo: string): void {
    this.dataFiltered = this.listOfData.filter((item) =>
      valores.length ? item[campo] === valores[0] : true
    );
  }

  generateFilters(campo: string): { text: string; value: string }[] {
    const valoresUnicos = [
      ...new Set(this.listOfData.map((item) => item[campo])),
    ];
    return valoresUnicos.map((valor) => ({
      text: valor,
      value: valor,
    }));
  }

  submitForm(buttonId: string): void {
    if (buttonId === 'limpiar') {
      this.modalService.confirmarLimpiarCampos(() => {
        this.resetForm();
      });
    } else if (buttonId === 'buscar') {
      this.searchForm();
      this.loadDataPending();
      this.loadData();
    }
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.dataFiltered.filter(
      ({ disabled }) => !disabled
    );
    this.checked = listOfEnabledData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.dataFiltered
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  generateInvoices() {
    const invoices = {
      idConsulta: '',
      comprobantes: [...this.setOfCheckedId].map((idComprobante) => {
        return {
          idComprobante: idComprobante,
        };
      }),
    };

    console.log(invoices);
  }

  onNumberDocumentInput(event: Event): void {
    this.handleInput('numeroDocumento', event);
  }

  onNumeberGuiaInput(event: Event): void {
    this.handleInput('numeroGuia', event);
  }

  disabledInitialDate = (current: Date): boolean => {
    const today = this.normalizeDate(this.today);
    const currentDate = this.normalizeDate(current);
    const minDate = this.normalizeDate(this.minDate);

    return currentDate > today || currentDate < minDate;
  };

  disabledFinalDate = (current: Date): boolean => {
    const initialDate: Date = this.invoiceForm.get('fechaInicial')?.value;

    const today = this.normalizeDate(this.today);
    const currentDate = this.normalizeDate(current);
    const minDate = this.normalizeDate(this.minDate);

    if (!initialDate) {
      return currentDate > today || currentDate < minDate;
    }

    const start = this.normalizeDate(initialDate);

    const maxFinalDate = new Date(start);
    maxFinalDate.setDate(maxFinalDate.getDate() + 5);

    const upperLimit = today < maxFinalDate ? today : maxFinalDate;

    return (
      currentDate < minDate || currentDate < start || currentDate > upperLimit
    );
  };
  //#endregion

  //#region Metodos Privados
  private setup() {
    this.invoiceForm = this.fb.group(
      {
        fechaInicial: [null],
        fechaFinal: [null],
        numeroGuia: [null, [Validators.pattern('^[0-9,]*$')]],
        numeroDocumento: [null, [Validators.pattern('^[0-9,]*$')]],
      },
      {
        validators: [
          dateRangeValidator,
          requiredDatesValidator,
          requiredFieldsConditionalValidator,
        ],
      }
    );
  }

  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private loadData() {
    this.dataFiltered = [...this.listOfData];
  }

  private loadDataPending() {
    this.dataPending = [
      {
        id: 1,
        numeroComprobante: 'PD-001',
        numeroGuia: 'GUIA-301',
        identificacionCliente: '123456789',
        nombreCliente: 'Cliente 1',
        estado: 'Pendiente',
      },
      {
        id: 2,
        numeroComprobante: 'PD-002',
        numeroGuia: 'GUIA-302',
        identificacionCliente: '123456790',
        nombreCliente: 'Cliente 2',
        estado: 'Pendiente',
      },
      {
        id: 3,
        numeroComprobante: 'PD-003',
        numeroGuia: 'GUIA-303',
        identificacionCliente: '123456791',
        nombreCliente: 'Cliente 3',
        estado: 'Pendiente',
      },
      {
        id: 4,
        numeroComprobante: 'PD-004',
        numeroGuia: 'GUIA-304',
        identificacionCliente: '123456792',
        nombreCliente: 'Cliente 4',
        estado: 'Pendiente',
      },
      {
        id: 5,
        numeroComprobante: 'PD-005',
        numeroGuia: 'GUIA-305',
        identificacionCliente: '123456793',
        nombreCliente: 'Cliente 5',
        estado: 'Pendiente',
      },
      {
        id: 6,
        numeroComprobante: 'PD-006',
        numeroGuia: 'GUIA-306',
        identificacionCliente: '123456794',
        nombreCliente: 'Cliente 6',
        estado: 'Pendiente',
      },
      {
        id: 7,
        numeroComprobante: 'PD-007',
        numeroGuia: 'GUIA-307',
        identificacionCliente: '123456795',
        nombreCliente: 'Cliente 7',
        estado: 'Pendiente',
      },
      {
        id: 8,
        numeroComprobante: 'PD-008',
        numeroGuia: 'GUIA-308',
        identificacionCliente: '123456796',
        nombreCliente: 'Cliente 8',
        estado: 'Pendiente',
      },
      {
        id: 9,
        numeroComprobante: 'PD-009',
        numeroGuia: 'GUIA-309',
        identificacionCliente: '123456797',
        nombreCliente: 'Cliente 9',
        estado: 'Pendiente',
      },
      {
        id: 10,
        numeroComprobante: 'PD-010',
        numeroGuia: 'GUIA-310',
        identificacionCliente: '123456798',
        nombreCliente: 'Cliente 10',
        estado: 'Pendiente',
      },
      {
        id: 11,
        numeroComprobante: 'PD-011',
        numeroGuia: 'GUIA-311',
        identificacionCliente: '123456799',
        nombreCliente: 'Cliente 11',
        estado: 'Pendiente',
      },
      {
        id: 12,
        numeroComprobante: 'PD-012',
        numeroGuia: 'GUIA-312',
        identificacionCliente: '123456800',
        nombreCliente: 'Cliente 12',
        estado: 'Pendiente',
      },
      {
        id: 13,
        numeroComprobante: 'PD-013',
        numeroGuia: 'GUIA-313',
        identificacionCliente: '123456801',
        nombreCliente: 'Cliente 13',
        estado: 'Pendiente',
      },
      {
        id: 14,
        numeroComprobante: 'PD-014',
        numeroGuia: 'GUIA-314',
        identificacionCliente: '123456802',
        nombreCliente: 'Cliente 14',
        estado: 'Pendiente',
      },
      {
        id: 15,
        numeroComprobante: 'PD-015',
        numeroGuia: 'GUIA-315',
        identificacionCliente: '123456803',
        nombreCliente: 'Cliente 15',
        estado: 'Pendiente',
      },
      {
        id: 16,
        numeroComprobante: 'PD-016',
        numeroGuia: 'GUIA-316',
        identificacionCliente: '123456804',
        nombreCliente: 'Cliente 16',
        estado: 'Pendiente',
      },
      {
        id: 17,
        numeroComprobante: 'PD-017',
        numeroGuia: 'GUIA-317',
        identificacionCliente: '123456805',
        nombreCliente: 'Cliente 17',
        estado: 'Pendiente',
      },
      {
        id: 18,
        numeroComprobante: 'PD-018',
        numeroGuia: 'GUIA-318',
        identificacionCliente: '123456806',
        nombreCliente: 'Cliente 18',
        estado: 'Pendiente',
      },
      {
        id: 19,
        numeroComprobante: 'PD-019',
        numeroGuia: 'GUIA-319',
        identificacionCliente: '123456807',
        nombreCliente: 'Cliente 19',
        estado: 'Pendiente',
      },
      {
        id: 20,
        numeroComprobante: 'PD-020',
        numeroGuia: 'GUIA-320',
        identificacionCliente: '123456808',
        nombreCliente: 'Cliente 20',
        estado: 'Pendiente',
      },
      {
        id: 21,
        numeroComprobante: 'PD-021',
        numeroGuia: 'GUIA-321',
        identificacionCliente: '123456809',
        nombreCliente: 'Cliente 21',
        estado: 'Pendiente',
      },
      {
        id: 22,
        numeroComprobante: 'PD-022',
        numeroGuia: 'GUIA-322',
        identificacionCliente: '123456810',
        nombreCliente: 'Cliente 22',
        estado: 'Pendiente',
      },
      {
        id: 23,
        numeroComprobante: 'PD-023',
        numeroGuia: 'GUIA-323',
        identificacionCliente: '123456811',
        nombreCliente: 'Cliente 23',
        estado: 'Pendiente',
      },
      {
        id: 24,
        numeroComprobante: 'PD-024',
        numeroGuia: 'GUIA-324',
        identificacionCliente: '123456812',
        nombreCliente: 'Cliente 24',
        estado: 'Pendiente',
      },
      {
        id: 25,
        numeroComprobante: 'PD-025',
        numeroGuia: 'GUIA-325',
        identificacionCliente: '123456813',
        nombreCliente: 'Cliente 25',
        estado: 'Pendiente',
      },
      {
        id: 26,
        numeroComprobante: 'PD-026',
        numeroGuia: 'GUIA-326',
        identificacionCliente: '123456814',
        nombreCliente: 'Cliente 26',
        estado: 'Pendiente',
      },
      {
        id: 27,
        numeroComprobante: 'PD-027',
        numeroGuia: 'GUIA-327',
        identificacionCliente: '123456815',
        nombreCliente: 'Cliente 27',
        estado: 'Pendiente',
      },
      {
        id: 28,
        numeroComprobante: 'PD-028',
        numeroGuia: 'GUIA-328',
        identificacionCliente: '123456816',
        nombreCliente: 'Cliente 28',
        estado: 'Pendiente',
      },
      {
        id: 29,
        numeroComprobante: 'PD-029',
        numeroGuia: 'GUIA-329',
        identificacionCliente: '123456817',
        nombreCliente: 'Cliente 29',
        estado: 'Pendiente',
      },
      {
        id: 30,
        numeroComprobante: 'PD-030',
        numeroGuia: 'GUIA-330',
        identificacionCliente: '123456818',
        nombreCliente: 'Cliente 30',
        estado: 'Pendiente',
      },
    ];

    this.listOfData = this.dataPending;
  }

  private handleInput(controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9,]/g, '');

    const numeros = value.split(',');
    const numerosValidados = numeros.map((num) => {
      if (num.length > 12) {
        return num.substring(0, 12);
      }
      return num;
    });

    const newValue = numerosValidados.join(',');
    this.invoiceForm.controls[controlName].setValue(newValue, {
      emitEvent: false,
    });
  }

  private resetForm(): void {
    this.invoiceForm.reset();
    this.invoiceForm.enable();
    this.dataFiltered = [];
    this.listOfData = [];
    this.setOfCheckedId.clear();
    this.checked = false;
  }

  private searchForm(): void {
    if (this.invoiceForm.valid) {
      this.showSuccessNotification();
      // Lógica para realizar la búsqueda
      this.invoiceForm.disable();
    } else {
      this.markAllControlsAsDirty();
      this.showErrorNotification();
    }
  }

  private markAllControlsAsDirty(): void {
    Object.values(this.invoiceForm.controls).forEach(
      (control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      }
    );
  }

  private showErrorNotification(): void {
    const errors = this.invoiceForm.errors;
    let title = 'Error de validación';
    let message = 'No fue posible realizar la consulta.';

    if (errors?.['dateRangeInvalid']) {
      title = 'Error en el rango de fechas';
      message = 'La fecha final no puede ser anterior a la fecha inicial.';
    } else if (errors?.['requiredDates']) {
      title = 'Faltan fechas obligatorias';
      message = 'Debes completar ambas fechas para continuar.';
    } else if (errors?.['requiredFieldsConditional']) {
      title = 'Faltan campos obligatorios';
      message =
        'Si las fechas están vacías, debes ingresar un número de guía o un número de documento.';
    }

    this.notification.createNotification('error', title, message);
  }

  private showSuccessNotification(): void {
    this.notification.createNotification(
      'success',
      'Consulta exitosa',
      'Los datos se han consultado correctamente.'
    );
  }
  //#endregion
}
