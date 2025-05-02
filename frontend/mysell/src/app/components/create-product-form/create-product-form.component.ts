import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product-form',
  templateUrl: './create-product-form.component.html',
  styleUrls: ['./create-product-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateProductFormComponent {
  categorySearch: string = '';
  filteredCategories: { name: string; pathSvg: string }[] = [];
  showDropdown: boolean = false;

  categories: { name: string; pathSvg: string }[] = [
    { name: 'Outros', pathSvg: 'assets/svg/categories/others.svg' },
    {
      name: 'Alimentos/Bebidas',
      pathSvg: 'assets/svg/categories/food-icon.svg',
    },
    { name: 'Tabaco/Cânabis', pathSvg: 'assets/svg/categories/tobacco.svg' },
    {
      name: 'Beleza / Cuidados Pessoais / Higiene',
      pathSvg: 'assets/icons/beleza-cuidados-pessoais-higiene.svg',
    },
    {
      name: 'Produtos de Limpeza / Higiene',
      pathSvg: 'assets/icons/produtos-limpeza-higiene.svg',
    },
    { name: 'Calçados', pathSvg: 'assets/icons/calcados.svg' },
    { name: 'Setor da Saúde', pathSvg: 'assets/icons/setor-saude.svg' },
    {
      name: 'Utensílios de cozinha e utensílios de mesa',
      pathSvg: 'assets/icons/utensilios-cozinha-mesa.svg',
    },
    {
      name: 'Mobiliário doméstico/para escritório',
      pathSvg: 'assets/icons/mobiliario-domestico-escritorio.svg',
    },
    {
      name: 'Equipamentos Esportivos',
      pathSvg: 'assets/icons/equipamentos-esportivos.svg',
    },
    {
      name: 'Segurança / Vigilância',
      pathSvg: 'assets/icons/seguranca-vigilancia.svg',
    },
    {
      name: 'Cuidados/alimentação para animais de estimação',
      pathSvg: 'assets/icons/cuidados-animais-estimacao.svg',
    },
    {
      name: 'Fluidos/Combustíveis/Gases',
      pathSvg: 'assets/icons/fluidos-combustiveis-gases.svg',
    },
    {
      name: 'Ligações elétricas',
      pathSvg: 'assets/icons/ligacoes-eletricas.svg',
    },
    {
      name: 'Segmento Transversal',
      pathSvg: 'assets/icons/segmento-transversal.svg',
    },
    { name: 'Vestuário', pathSvg: 'assets/icons/vestuario.svg' },
    { name: 'Veículo', pathSvg: 'assets/icons/veiculo.svg' },
    { name: 'Eletrodomésticos', pathSvg: 'assets/icons/eletrodomesticos.svg' },
    {
      name: 'Materiais de Referência/Impressos/Textuais',
      pathSvg: 'assets/icons/materiais-referencia-impressos-textuais.svg',
    },
    { name: 'Música', pathSvg: 'assets/icons/musica.svg' },
    {
      name: 'Acessórios Pessoais',
      pathSvg: 'assets/icons/acessorios-pessoais.svg',
    },
    { name: 'Informática', pathSvg: 'assets/icons/informatica.svg' },
    { name: 'Comunicações', pathSvg: 'assets/icons/comunicacoes.svg' },
    {
      name: 'Artigos de Papelaria/ Equipamentos para Escritório',
      pathSvg: 'assets/icons/papelaria-equipamentos-escritorio.svg',
    },
    {
      name: 'Audiovisual / Fotografia',
      pathSvg: 'assets/icons/audiovisual-fotografia.svg',
    },
    {
      name: 'Trabalho Artístico/Artesanato/Bordado',
      pathSvg: 'assets/icons/artes-artesanato-bordado.svg',
    },
    { name: 'Acampamento', pathSvg: 'assets/icons/acampamento.svg' },
    {
      name: 'Produtos para Construção',
      pathSvg: 'assets/icons/produtos-construcao.svg',
    },
    {
      name: 'Ferramentas/Equipamentos-Manuais',
      pathSvg: 'assets/icons/ferramentas-equipamentos-manuais.svg',
    },
    {
      name: 'Encanamento/Aquecimento/Ventilação/Ar Condicionado',
      pathSvg: 'assets/icons/encanamento-aquecimento-ventilacao-ar.svg',
    },
    {
      name: 'Artigos de gramado/jardinagem',
      pathSvg: 'assets/icons/gramado-jardinagem.svg',
    },
    {
      name: 'Plantas de Horticultura',
      pathSvg: 'assets/icons/plantas-horticultura.svg',
    },
    {
      name: 'Equipamentos para Oficina/Armazenagem de Ferramentas',
      pathSvg: 'assets/icons/oficina-armazenagem-ferramentas.svg',
    },
    {
      name: 'Ferramentas/Equipamentos-Elétricos',
      pathSvg: 'assets/icons/ferramentas-equipamentos-eletricos.svg',
    },
    { name: 'Brinquedos/Jogos', pathSvg: 'assets/icons/brinquedos-jogos.svg' },
    { name: 'Lubrificantes', pathSvg: 'assets/icons/lubrificantes.svg' },
    { name: 'Animais Vivos', pathSvg: 'assets/icons/animais-vivos.svg' },
    {
      name: 'Segurança / Proteção - Bricolagem',
      pathSvg: 'assets/icons/seguranca-protecao-bricolagem.svg',
    },
    {
      name: 'Recipientes para armazenamento/transporte',
      pathSvg: 'assets/icons/recipientes-armazenamento-transporte.svg',
    },
    { name: 'Culturas', pathSvg: 'assets/icons/culturas.svg' },
    {
      name: 'Serviços / Máquinas de Venda',
      pathSvg: 'assets/icons/servicos-maquinas-venda.svg',
    },
    {
      name: 'Moeda / Certificados',
      pathSvg: 'assets/icons/moeda-certificados.svg',
    },
    {
      name: 'Matérias-primas (Não Alimentos)',
      pathSvg: 'assets/icons/materias-primas-nao-alimentos.svg',
    },
    {
      name: 'Produtos Post mortem',
      pathSvg: 'assets/icons/produtos-post-mortem.svg',
    },
    {
      name: 'Bombas/Sistemas de Fluidos Industriais',
      pathSvg: 'assets/icons/bombas-fluidos-industriais.svg',
    },
  ];

  filterCategories() {
    const search = this.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(search)
    );
  }

  selectCategory(category: { name: string; pathSvg: string }) {
    this.categorySearch = category.name;
    this.product.category = category.name;
    this.showDropdown = false;
  }

  hideDropdown() {
    setTimeout(() => (this.showDropdown = false), 200);
  }

  showModal = true;
  product = {
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    brand: '',
    measure: '',
  };

  closeModal() {
    this.showModal = false;
  }

  confirmProduct() {
    console.log('Product added:', this.product);
    this.closeModal();
  }
}
