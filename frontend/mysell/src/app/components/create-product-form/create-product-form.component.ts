import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  name: string;
  pathSvg: string;
}

type Measure = string;

@Component({
  selector: 'app-create-product-form',
  templateUrl: './create-product-form.component.html',
  styleUrls: ['./create-product-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateProductFormComponent {
  // Inputs
  @Input() showModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  // Product model
  product = {
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    brand: '',
    measure: '',
  };

  // Category dropdown state
  categorySearch = '';
  filteredCategories: Category[] = [];
  showDropdown = false;

  // Measure dropdown state
  measureSearch = '';
  filteredMeasures: Measure[] = [];
  showMeasureDropdown = false;

  // Static data
  categories: Category[] = [
    { name: 'Outros', pathSvg: 'assets/svg/categories/others.svg' },
    {
      name: 'Alimentos/Bebidas',
      pathSvg: 'assets/svg/categories/food-icon.svg',
    },
    { name: 'Tabaco/Cânabis', pathSvg: 'assets/svg/categories/tobacco.svg' },
    {
      name: 'Beleza / Cuidados Pessoais / Higiene',
      pathSvg: 'assets/svg/categories/beauty-cream-icon.svg',
    },
    {
      name: 'Produtos de Limpeza / Higiene',
      pathSvg: 'assets/svg/categories/cleaning-spray-icon.svg',
    },
    { name: 'Calçados', pathSvg: 'assets/svg/categories/boot-icon.svg' },
    {
      name: 'Setor da Saúde',
      pathSvg: 'assets/svg/categories/stethoscope-icon.svg',
    },
    {
      name: 'Utensílios de cozinha e utensílios de mesa',
      pathSvg: 'assets/svg/categories/kitchen-cooking-pot-non-stick-icon.svg',
    },
    {
      name: 'Mobiliário doméstico/para escritório',
      pathSvg: 'assets/svg/categories/office-chair-icon.svg',
    },
    {
      name: 'Equipamentos Esportivos',
      pathSvg: 'assets/svg/categories/table-tennis-icon.svg',
    },
    {
      name: 'Segurança / Vigilância',
      pathSvg: 'assets/svg/categories/lock-icon.svg',
    },
    {
      name: 'Cuidados/alimentação para animais de estimação',
      pathSvg: 'assets/svg/categories/paw-icon.svg',
    },
    {
      name: 'Fluidos/Combustíveis/Gases',
      pathSvg: 'assets/svg/categories/gas-pump-icon.svg',
    },
    {
      name: 'Ligações elétricas',
      pathSvg: 'assets/svg/categories/electric-plugin-icon.svg',
    },
    {
      name: 'Segmento Transversal',
      pathSvg: 'assets/svg/categories/minus-square-line-icon.svg',
    },
    {
      name: 'Vestuário',
      pathSvg: 'assets/svg/categories/men-t-shirts-icon.svg',
    },
    {
      name: 'Veículo',
      pathSvg: 'assets/svg/categories/steering-wheel-icon.svg',
    },
    {
      name: 'Eletrodomésticos',
      pathSvg: 'assets/svg/categories/fridge-icon.svg',
    },
    {
      name: 'Materiais de Referência/Impressos/Textuais',
      pathSvg: 'assets/svg/categories/print-icon.svg',
    },
    { name: 'Música', pathSvg: 'assets/svg/categories/music-icon.svg' },
    {
      name: 'Acessórios Pessoais',
      pathSvg: 'assets/svg/categories/eye-blind-icon.svg',
    },
    { name: 'Informática', pathSvg: 'assets/svg/categories/laptop-icon.svg' },
    { name: 'Comunicações', pathSvg: 'assets/svg/categories/talk-icon.svg' },
    {
      name: 'Artigos de Papelaria/ Equipamentos para Escritório',
      pathSvg: 'assets/svg/categories/edit-list-icon.svg',
    },
    {
      name: 'Audiovisual / Fotografia',
      pathSvg: 'assets/svg/categories/camera-icon.svg',
    },
    {
      name: 'Trabalho Artístico/Artesanato/Bordado',
      pathSvg: 'assets/svg/categories/edit-list-icon.svg',
    },
    { name: 'Acampamento', pathSvg: 'assets/svg/categories/tent-icon.svg' },
    {
      name: 'Produtos para Construção',
      pathSvg: 'assets/svg/categories/building-icon.svg',
    },
    {
      name: 'Ferramentas/Equipamentos-Manuais',
      pathSvg: 'assets/svg/categories/screwdriver-icon.svg',
    },
    {
      name: 'Encanamento/Aquecimento/Ventilação/Ar Condicionado',
      pathSvg: 'assets/svg/categories/air-conditioner-icon.svg',
    },
    {
      name: 'Artigos de gramado/jardinagem',
      pathSvg: 'assets/svg/categories/gardening-farming-icon.svg',
    },
    {
      name: 'Plantas de Horticultura',
      pathSvg: 'assets/svg/categories/plant-root-icon.svg',
    },
    {
      name: 'Equipamentos para Oficina/Armazenagem de Ferramentas',
      pathSvg: 'assets/svg/categories/tools-icon.svg',
    },
    {
      name: 'Ferramentas/Equipamentos-Elétricos',
      pathSvg: 'assets/svg/categories/spark-icon.svg',
    },
    {
      name: 'Brinquedos/Jogos',
      pathSvg: 'assets/svg/categories/gamepad-icon.svg',
    },
    {
      name: 'Lubrificantes',
      pathSvg: 'assets/svg/categories/engine-motor-icon.svg',
    },
    {
      name: 'Animais Vivos',
      pathSvg: 'assets/svg/categories/horse-head-icon.svg',
    },
    {
      name: 'Segurança / Proteção - Bricolagem',
      pathSvg: 'assets/svg/categories/screwdriver-icon.svg',
    },
    {
      name: 'Recipientes para armazenamento/transporte',
      pathSvg: 'assets/svg/categories/gas-cylinder-black-icon.svg',
    },
    { name: 'Culturas', pathSvg: 'assets/svg/categories/plant-root-icon.svg' },
    {
      name: 'Serviços / Máquinas de Venda',
      pathSvg: 'assets/svg/categories/solution-strategy-icon.svg',
    },
    {
      name: 'Moeda / Certificados',
      pathSvg: 'assets/svg/categories/dollar-coin-solid-icon.svg',
    },
    {
      name: 'Matérias-primas (Não Alimentos)',
      pathSvg: 'assets/svg/categories/textile-icon.svg',
    },
    {
      name: 'Produtos Post mortem',
      pathSvg: 'assets/svg/categories/danger-icon.svg',
    },
    {
      name: 'Bombas/Sistemas de Fluidos Industriais',
      pathSvg: 'assets/svg/categories/engine-motor-icon.svg',
    },
  ];

  measures: Measure[] = [
    'NONE',
    'ml',
    'l',
    'mg',
    'g',
    'kg',
    'lb',
    'oz',
    'un',
    'mm',
    'cm',
    'm',
    'km',
  ];

  // Category methods
  filterCategories(): void {
    const term = this.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(term)
    );
  }

  selectCategory(category: Category): void {
    this.categorySearch = category.name;
    this.product.category = category.name;
    this.showDropdown = false;
  }

  hideDropdown(): void {
    setTimeout(() => (this.showDropdown = false), 200);
  }

  // Measure methods
  filterMeasures(): void {
    const term = this.measureSearch.toLowerCase();
    this.filteredMeasures = this.measures.filter((m) =>
      m.toLowerCase().includes(term)
    );
  }

  selectMeasure(measure: Measure): void {
    this.measureSearch = measure;
    this.product.measure = measure;
    this.showMeasureDropdown = false;
  }

  hideMeasureDropdown(): void {
    setTimeout(() => (this.showMeasureDropdown = false), 200);
  }

  // Modal methods
  closeModal(): void {
    this.closeModalEvent.emit();
  }

  confirmProduct(): void {
    console.log('Product added:', this.product);
    this.closeModal();
  }
}
