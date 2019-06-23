import { Component, TemplateRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../services/user.service';
import { ClientService } from '../services/client.service';
import { CategoryService } from '../services/category.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  modalRef: BsModalRef;
  today = new Date();
  date: any;
  user: any;
  client: any;
  clients: any;
  city = 'Novi Sad';
  tax = 0.18;
  categories: any = [];
  values: any;
  option = 'racun';
  invoiceNumber = '';

  constructor(
    private modalService: BsModalService,
    private elRef: ElementRef,
    private userService: UserService,
    private clientService: ClientService,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.userService.getUser()
      .subscribe(res => {
        this.user = res;
      });

    this.clientService.getClient(1)
      .subscribe(res => {
        this.client = res;
      });

    this.clientService.getAll()
      .subscribe(res => {
        this.clients = res;
      });

    this.categoryService.getAll()
      .subscribe(res => {
        this.values = res;
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addItem(category: string) {
    const cat = this.categories.filter(c => c.category === category)[0];
    cat.items.push({
      id: Math.floor(Math.random() * 100)
    });
    // setTimeout(() => {
    //   window.scrollTo({
    //     top: document.querySelector("body").scrollHeight,
    //     left: 0,
    //     behavior: 'smooth'
    //   });
    // }, 0);
  }

  addCategory(category: string) {
    this.categories.push({
      category,
      items: []
    });
    this.modalRef.hide();
    // setTimeout(() => {
    //   window.scrollTo({
    //     top: document.querySelector("body").scrollHeight,
    //     left: 0,
    //     behavior: 'smooth'
    //   });
    // }, 0);
  }

  removeCategory(category: string) {
    this.categories = this.categories.filter(c => c.category !== category);
  }

  removeItemFromCategory(category: string, item: any) {
    for (const c of this.categories) {
      if (c.title === category) {
        c.items = c.items.filter(e => e.id !== item.id);
      }
    }
  }

  generatePDF() {
    const content = [];

    content.push({
      columns: [
        { width: '50%', text: this.user.name, style: 'header' },
      ]
    });
    content.push({
      columns: [
        {
          width: '50%', columns: [
            {
              width: '60%', text: `Adresa
          Telefon:
          Ziro racun br:
          Maticni broj:
          Reg. broj:
          Sifra delatnosti:
          PIB:
          `,
            },
            {
              width: '40%', style: { alignment: 'left' }, text: `${this.user.address}
          ${this.user.tel}
          ${this.user.ziro}
          ${this.user.mat}
          ${this.user.reg}
          ${this.user.sif}
          ${this.user.pib}
          `}
          ]
        },
        {
          width: '50%', text: `${this.option.toUpperCase()} - ${this.invoiceNumber}`
        }
      ]
    });

    content.push({
      columns: [
        {
          marginBottom: 30
          ,
          width: '50%',
          columns: [
            {
              width: '60%', text: `Datum izdavanje racuna:
              Mesto izdavanje racuna:
              Datum prometa dobara i usluga:
              Mesto prometa dobara i usluga:
              `
            },
            {
              width: '40%', text: `${this.date}
              ${this.city}
              ${this.date}
              ${this.city}
              `
            }
          ]
        },
        {
          width: '50%',
          columns: [
            {
              width: '100%', text: `${this.client.name}
              ${this.client.address}
              ${this.client.city}
              PIB: 123456
              `
            },
          ]
        }
      ]
    });

    // content.push({
    //   table: {
    //     widths: ['*', '*', '*', '*', '*', '*', '*'],
    //     body: [
    //       [
    //         { text: 'Naziv usluge' },
    //         { text: 'Kolicina' },
    //         { text: 'JM' },
    //         { text: 'Cena' },
    //         { text: 'Bez PDV-a' },
    //         { text: 'PDV(0.18%)' },
    //         { text: 'Ukupno' }
    //       ],
    //     ]
    //   },
    //   layout: 'noBorders'
    // });

    const mainHeader = [
      { text: 'Naziv usluge' },
      { text: 'Kolicina' },
      { text: 'JM' },
      { text: 'Cena' },
      { text: 'Bez PDV-a' },
      { text: 'PDV(0.18%)' },
      { text: 'Ukupno' }
    ];

    for (const c of this.categories) {
      const rows = [];
      for (const [idx, i] of c.items.entries()) {
        // tslint:disable-next-line: max-line-length
        rows.push([`${i.service}`,
        `${i.amount}`, `${i.unit || ''}`,
        `${(+i.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
        `${(+i.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
        `${(i.total * .18).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
        `${(i.total + (i.total * .18)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`]);
      }

      content.push({
        table: {
          widths: ['30%', '*', '*', '*', '*', '*', '*'],
          headerRows: 1,
          body: [
            mainHeader,
            [{ text: `${c.category}`, colSpan: 5 }, {}, {}, {}, {}, {}, {}],
            ...rows,
            [{ text: `${c.category}`, colSpan: 2, bold: true }, {}, {}, {},
            { text: `${(c.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` },
            { text: `${(c.total * .18).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` },
            { text: `${(c.total + c.total * .18).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }
            ],
          ]
        },
        layout: 'lightHorizontalLines'
      });
    }



    content.push({
      columns: [
        { width: '50%', text: '', marginTop: 30, },
        {
          width: '50%',
          marginTop: 30,
          columns: [
            {
              width: '50%', text: `Ukupno:
            PDV:
            Ukupno sa PDV-om:
            ` },
            {
              width: '50%', style: { alignment: 'right' }, text: `${this.getTotalAll().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              ${(this.getTotalAll() * .18).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              ${(this.getTotalAll() * .18 + this.getTotalAll()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            ` }
          ]
        }
      ]
    });


    const dd = {
      content,
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          marginBottom: 20
        }
      },
      defaultStyle: {
        fontSize: 10
      }
    };

    pdfMake.createPdf(dd).open();
  }

  change(category, id, value, item) {
    const c = this.categories.filter(c => c.category === category)[0];
    for (const i of c.items) {
      if (i.id === id) {
        i[item] = value;
      }
    }
  }

  getTotal(category: string) {
    const c = this.categories.filter(c => c.category === category)[0];
    let total = 0;
    for (const i of c.items) {
      if (i.amount && i.price) {
        total += (i.amount * i.price);
      }
    }
    c.total = total;
    return total;
  }

  getTotalAll() {
    let total = 0;
    for (const c of this.categories) {
      for (const i of c.items) {
        if (i.amount && i.price) {
          total += i.total = (i.amount * i.price);
        }
      }
    }
    return total;
  }

  onValueChange(event) {
    this.date = event.toLocaleDateString();
  }

  selectClient(id: number) {
    this.client = this.clients.filter(c => c.id === id)[0];
    this.modalRef.hide();
  }

  save() {
    console.log(this.categories);
  }
}
