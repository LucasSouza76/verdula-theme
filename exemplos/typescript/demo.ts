// Arquivo de exemplo para visualizar o tema Verdula

/**
 * Representa um usuário do sistema.
 * @param nome - nome completo
 */
interface Usuario {
  id: number;
  nome: string;
  ativo: boolean;
}

enum Status {
  Ativo = "ATIVO",
  Inativo = "INATIVO",
}

const LIMITE_MAXIMO = 100;
const padraoEmail = /^[\w.-]+@[\w-]+\.\w{2,}$/;

function log<T>(metodo: T, contexto: ClassMethodDecoratorContext): T {
  console.log(`Método ${String(contexto.name)} decorado\n`);
  return metodo;
}

export class RepositorioDeUsuarios<T extends Usuario> {
  private itens: T[] = [];

  constructor(private readonly origem: string) {}

  @log
  async carregar(): Promise<T[]> {
    // TODO: tratar erros de rede
    const resposta = await fetch(this.origem);
    this.itens = (await resposta.json()) as T[];
    return this.itens.filter((u) => u.ativo && u.id < LIMITE_MAXIMO);
  }

  buscar(id: number): T | undefined {
    return this.itens.find((usuario) => usuario.id === id);
  }
}

const repo = new RepositorioDeUsuarios("/api/usuarios");
repo.carregar().then((lista) => {
  console.log(lista.length > 0 ? Status.Ativo : Status.Inativo, padraoEmail.test("a@b.com"));
});
