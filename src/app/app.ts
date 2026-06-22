import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicionado OnDestroy
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs'; // Importado interval e Subscription

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit, OnDestroy { // Adicionado OnDestroy

  //apiUrl = 'http://localhost:3000/produtos';
  apiUrl = '/api/produtos';

  produtos: any[] = [];

  novoProduto: any = {
    nome: '',
    preco: null,
    quantidade: null
  };

  produtoEditando: any = null;

  // Guarda a inscrição do intervalo para limpá-lo depois
  private repetidorSubscription!: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.listar(); // Mantido a primeira chamada direta aqui
    this.iniciarRepeticao(); // Inicia a contagem dos 10 segundos
  }

  listar() {
    this.http.get<any[]>(this.apiUrl)
      .subscribe(res => {
        // SÓ atualiza a lista se o usuário NÃO estiver editando uma linha agora
        // Isso evita que o texto suma enquanto o usuário digita na tabela
        if (!this.produtoEditando) {
          this.produtos = res;
        }
      });
  }

  // Função nova que apenas chama o listar() a cada 10 segundos
  iniciarRepeticao() {
    this.repetidorSubscription = interval(10000) // 10000ms = 10 segundos
      .subscribe(() => {
        this.listar();
      });
  }

  // CADASTRAR
  cadastrar() {
    // Validação frontend contra números negativos
    if (this.novoProduto.preco < 0 || this.novoProduto.quantidade < 0) {
      alert('O preço e a quantidade não podem ser negativos!');
      return;
    }

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
    // Validação frontend contra números negativos na edição
    if (this.produtoEditando.preco < 0 || this.produtoEditando.quantidade < 0) {
      alert('O preço e a quantidade não podem ser negativos!');
      return;
    }

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

  // Destrói o intervalo se o usuário sair desta tela
  ngOnDestroy() {
    if (this.repetidorSubscription) {
      this.repetidorSubscription.unsubscribe();
    }
  }
}