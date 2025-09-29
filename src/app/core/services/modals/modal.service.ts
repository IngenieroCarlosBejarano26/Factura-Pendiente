import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ComponentType } from '@angular/cdk/portal';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modal: NzModalService) {}
  confirmarCerrarSesion(
    onOkCallback?: () => void,
    onCancelCallback?: () => void
  ) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro que quieres cerrar sesión?',
      nzContent: '',
      nzOkText: 'Sí, cerrar sesión',
      nzOkType: 'primary',
      nzCancelText: 'Cancelar',
      nzWidth: 450,
      nzCentered: true,
      nzOnOk: () => {
        if (onOkCallback) {
          onOkCallback();
        }
      },
      nzOnCancel: () => {
        if (onCancelCallback) {
          onCancelCallback();
        }
      },
    });
  }

  crearModal(title: string, component: ComponentType<any>, params?: any) {
    this.modal.create({
      nzTitle: title,
      nzContent: component,
      nzCentered: true,
      nzData: params,
    });
  }

  confirmarLimpiarCampos(
    onOkCallback?: () => void,
    onCancelCallback?: () => void
  ) {
    this.modal.confirm({
      nzTitle: '¿Confirmas que deseas restablecer los campos?',
      nzContent:
        'Esta acción borrará toda la información que has ingresado. ¿Estás seguro de que quieres continuar?',
      nzOkText: 'Sí, restablecer',
      nzOkType: 'primary',
      nzCancelText: 'No, cancelar',
      nzWidth: 450,
      nzCentered: true,
      nzOnOk: () => onOkCallback?.(),
      nzOnCancel: () => onCancelCallback?.(),
    });
  }
}
