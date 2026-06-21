import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit {

  //apiUrl = 'http://localhost:3000/produtos';
  apiUrl = '/api/produtos';

  produtos: any[] = [];

  novoProduto: any = {
    nome: '',
    preco: null,
    quantidade: null
  };

  produtoEditando: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  this.listar();
  }

  listar() {
    this.http.get<any[]>(this.apiUrl)
      .subscribe(res => {
        this.produtos = res;
      });
  }

  // CADASTRAR
  cadastrar() {
  this.http.post(this.apiUrl, this.novoProduto)
    .subscribe((novo: any) => {
      this.produtos.push(novo); // adiciona direto na lista
      this.novoProduto = { nome: '', preco: null, quantidade: null };
    });
  }

  // DELETAR
  deletar(id: number) {
  this.http.delete(`${this.apiUrl}/${id}`)
    .subscribe(() => {
      this.produtos = this.produtos.filter(p => p.id !== id);
    });
  }

  // EDITAR
  editar(produto: any) {
    this.produtoEditando = { ...produto };
  }

  // ATUALIZAR
  atualizar() {
  this.http.put(`${this.apiUrl}/${this.produtoEditando.id}`, this.produtoEditando)
    .subscribe((atualizado: any) => {

      const index = this.produtos.findIndex(p => p.id === atualizado.id);
      this.produtos[index] = atualizado;

      this.produtoEditando = null;
    });
  }

  cancelar() {
    this.produtoEditando = null;
  }

  trackById(index: number, produto: any) {
    return produto.id;
  }
}