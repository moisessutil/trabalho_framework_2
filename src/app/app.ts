import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // Adicionado ChangeDetectorRef
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit, OnDestroy {

  //apiUrl = 'http://localhost:3000/produtos';
  apiUrl = '/api/produtos';

  produtos: any[] = [];

  novoProduto: any = {
    nome: '',
    preco: null,
    quantidade: null
  };

  produtoEditando: any = null;

  private repetidorSubscription!: Subscription;

  // Injetando o cdr (ChangeDetectorRef) no construtor
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.listar(); 
    this.iniciarRepeticao(); 
  }

  listar() {
    this.http.get<any[]>(this.apiUrl)
      .subscribe({
        next: (res) => {
          if (!this.produtoEditando) {
            this.produtos = res;
            this.cdr.detectChanges(); // <--- FORÇA O ANGULAR A ATUALIZAR A TELA
          }
        },
        error: (err) => console.error('Erro ao buscar produtos:', err)
      });
  }

  iniciarRepeticao() {
    this.repetidorSubscription = interval(10000) // 10 segundos
      .subscribe(() => {
        this.listar();
      });
  }

  // CADASTRAR
  cadastrar() {
    if (this.novoProduto.preco < 0 || this.novoProduto.quantidade < 0) {
      alert('O preço e a quantidade não podem ser negativos!');
      return;
    }

    this.http.post(this.apiUrl, this.novoProduto)
      .subscribe((novo: any) => {
        this.produtos.push(novo); 
        this.novoProduto = { nome: '', preco: null, quantity: null };
        this.cdr.detectChanges(); // Atualiza a tela após cadastrar
      });
  }

  // DELETAR
  deletar(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.cdr.detectChanges(); // Atualiza a tela após deletar
      });
  }

  // EDITAR
  editar(produto: any) {
    this.produtoEditando = { ...produto };
  }

  // ATUALIZAR
  atualizar() {
    if (this.produtoEditando.preco < 0 || this.produtoEditando.quantidade < 0) {
      alert('O preço e a quantidade não podem ser negativos!');
      return;
    }

    this.http.put(`${this.apiUrl}/${this.produtoEditando.id}`, this.produtoEditando)
      .subscribe((atualizado: any) => {
        const index = this.produtos.findIndex(p => p.id === atualizado.id);
        this.produtos[index] = atualizado;
        this.produtoEditando = null;
        this.cdr.detectChanges(); // Atualiza a tela após editar
      });
  }

  cancelar() {
    this.produtoEditando = null;
  }

  trackById(index: number, produto: any) {
    return produto.id;
  }

  ngOnDestroy() {
    if (this.repetidorSubscription) {
      this.repetidorSubscription.unsubscribe();
    }
  }
}