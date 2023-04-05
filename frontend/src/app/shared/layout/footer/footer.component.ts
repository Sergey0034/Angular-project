import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OrderService} from "../../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderType} from "../../../../types/order.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  phoneCheck : string = '0 (000) 000 00 00' || '+0 (000) 000 00 00';

  @ViewChild('popupOrderFooter') popupOrderFooter!: TemplateRef<ElementRef>;
  dialogRefOrderFooter: MatDialogRef<any> | null = null;

  @ViewChild('popupOrderAccessFooter') popupOrderAccessFooter!: TemplateRef<ElementRef>;
  dialogRefOrderAccessFooter: MatDialogRef<any> | null = null;

  errorOrderSend = false;

  serviceTitleOrderFooter = 'Бесплатная консультация';



  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private orderService: OrderService,
              private _snackBar: MatSnackBar) {
  }

  orderFooterForm = this.fb.group({
    name: ['', [Validators.pattern(/^([А-Я][а-я]+\s*)+$/), Validators.required]],
    phone: ['', [Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/), Validators.required]],
    type: ['consultation']
  });

  orderSendFooter() {
    this.dialogRefOrderFooter = this.dialog.open(this.popupOrderFooter);

    this.dialogRefOrderFooter?.backdropClick()
      .subscribe(() => {
        this.orderFooterForm.patchValue({
          name: '',
          phone: ''
        });
        this.orderFooterForm.markAsUntouched();
        this.orderFooterForm.markAsPristine();
      });

  }

  closePopupOrderFooter() {
    this.dialogRefOrderFooter?.close();
    this.orderFooterForm.patchValue({
      name: '',
      phone: '',
    });

    this.orderFooterForm.markAsUntouched();
    this.orderFooterForm.markAsPristine();
  }

  closePopupOrderAccess() {
    this.dialogRefOrderAccessFooter?.close();
  }

  createOrderFooter() {
    if (this.orderFooterForm.valid &&  this.orderFooterForm.value.name
      &&  this.orderFooterForm.value.phone &&  this.orderFooterForm.value.type) {

      const paramsObject: OrderType = {
        name: this.orderFooterForm.value.name,
        phone: '+7' + this.orderFooterForm.value.phone,
        type: this.orderFooterForm.value.type,
      };

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this.errorOrderSend = true;
              throw new Error(data.message);
            }

            this.dialogRefOrderFooter?.close();
            this.dialogRefOrderAccessFooter = this.dialog.open(this.popupOrderAccessFooter);

            this.orderFooterForm.patchValue({
              name: '',
              phone: '',
            });
            this.orderFooterForm.markAsUntouched();
            this.orderFooterForm.markAsPristine();

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки запроса');
            }
          }
        });
    } else {
      this.orderFooterForm.get('name')?.markAsTouched();
      this.orderFooterForm.get('phone')?.markAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }

  firstClickInputPhone = false;

  changeInputPhoneFocus() {
    const input: HTMLElement | null = document.getElementById("mytextbox");

    if (input) {
      input.focus();
      (input as HTMLInputElement).setSelectionRange(4,4);
    }

    this.firstClickInputPhone = true;

  }

}
