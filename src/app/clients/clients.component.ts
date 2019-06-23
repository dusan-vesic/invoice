import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styles: []
})
export class ClientsComponent implements OnInit {

  clients: any;

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.clientService.getClients2()
    .subscribe(data => {
      this.clients = data.map(e => {
        return {
          name: e.payload.doc.id,
          ...e.payload.doc.data()
        } as any;
      })
    });
  }

}
