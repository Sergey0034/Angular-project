import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {OrderService} from "../../shared/services/order.service";
import {OrderType} from "../../../types/order.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterContentInit {

  customOptionsBanner: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 26,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  services = [
    {
      image: '/assets/images/services/service-image1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽'
    },
    {
      image: '/assets/images/services/service-image2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽'
    },
    {
      image: '/assets/images/services/service-image3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽'
    },
    {
      image: '/assets/images/services/service-image4.png',
      title: 'Копирайтинг',
      text: ' Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽'
    }
  ];

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Аделина',
      image: 'review4.jpg',
      text: 'Хочу поблагодарить всю команду за помощь в создании сайта! Все получилось здорово! А самое главное, что сайт приносит заявки.'
    },
    {
      name: 'Яника',
      image: 'review5.jpg',
      text: 'Спасибо большое за мою обновлённую версию сайта! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: 'Марина',
      image: 'review6.jpg',
      text: 'Для меня всегда важным аспектом было не только грамотное решение сложного вопроса, но и результат работы. Ещё нигде не встречала такой великолепной команды!'
    },
  ];

  serviceTitleOrder = '';

  orderForm = this.fb.group({
    service: ['', Validators.required],
    name: ['', [Validators.pattern(/^([А-Я][а-я]+\s*)+$/), Validators.required]],
    phone: ['', [Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/), Validators.required]],
    type: ['order']
  });

  @ViewChild('popupOrder') popupOrder!: TemplateRef<ElementRef>;
  dialogRefOrder: MatDialogRef<any> | null = null;

  @ViewChild('popupOrderAccess') popupOrderAccess!: TemplateRef<ElementRef>;
  dialogRefOrderAccess: MatDialogRef<any> | null = null;

  errorOrderSend = false;

  articles: ArticleType[] = [];

  userInfo: string | null = null;
  isLogged = false;

  static anchor: string | null = null;

  constructor(private articleService: ArticleService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private orderService: OrderService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {

    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
  }

  ngAfterContentInit() {
    setTimeout(()=> {
      this.scrollToElementInMain();
    }, 1);

  }

  orderSend(title: string) {
    this.dialogRefOrder = this.dialog.open(this.popupOrder);
    this.serviceTitleOrder = title;
    if (this.serviceTitleOrder) {
      this.orderForm.patchValue({service: this.serviceTitleOrder});
    }

    this.dialogRefOrder?.backdropClick()
      .subscribe(() => {
        this.orderForm.patchValue({
          name: '',
          phone: '',
          service: ''
        });
        this.orderForm.markAsUntouched();
        this.orderForm.markAsPristine();
      });
  }

  closePopupOrder() {
    this.dialogRefOrder?.close();
    this.orderForm.patchValue({
      name: '',
      phone: '',
      service: ''
    });
  }

  closePopupOrderAccess() {
    this.dialogRefOrderAccess?.close();
    this.orderForm.patchValue({
      name: '',
      phone: '',
      service: ''
    });
  }

  createOrder() {

    if (this.orderForm.valid && this.orderForm.value.service &&  this.orderForm.value.name
    &&  this.orderForm.value.phone &&  this.orderForm.value.type) {

      const paramsObject: OrderType = {
        name: this.orderForm.value.name,
        phone: '+7' + this.orderForm.value.phone,
        service: this.orderForm.value.service,
        type: this.orderForm.value.type,
      };

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this.errorOrderSend = true;
              throw new Error(data.message);
            }

            this.dialogRefOrder?.close();
            this.dialogRefOrderAccess = this.dialog.open(this.popupOrderAccess);

            this.orderForm.patchValue({
              name: '',
              phone: '',
              service: ''
            });

            this.orderForm.markAsUntouched();
            this.orderForm.markAsPristine();

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
      this.orderForm.get('name')?.markAsTouched();
      this.orderForm.get('phone')?.markAsTouched();
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

  scrollToElementInMain(): void {
    if (MainComponent.anchor) {
      const element = document.getElementById(MainComponent.anchor);
      if (element) {
        element.scrollIntoView({behavior: "smooth"});
      }
    }

    MainComponent.anchor = null;
  }

  public static scrollToElement(target: HTMLElement | null): void {
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }
  }
}
