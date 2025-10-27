import type { Commission, Sale, Stock, Distributor, Product } from '../types/domain';

export class DistributionManager {
  private commissions: Commission[] = [];
  private sales: Sale[] = [];
  private stocks: Stock[] = [];
  private distributors: Distributor[] = [];
  private products: Product[] = [];

  // ========== GESTION DES PRODUITS ==========
  addProduct(productData: Omit<Product, 'id'>): Product {
    const product: Product = {
      ...productData,
      id: this.generateId(),
    };
    this.products.push(product);
    return product;
  }

  updateProduct(productId: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  getProduct(productId: string): Product | null {
    return this.products.find(p => p.id === productId) || null;
  }

  getAllProducts(): Product[] {
    return [...this.products];
  }

  deleteProduct(productId: string): boolean {
    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // ========== GESTION DES COMMISSIONS ==========
  configureCommission(config: Omit<Commission, 'id' | 'createdAt' | 'updatedAt'>): Commission {
    const commission: Commission = {
      ...config,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.commissions.push(commission);
    return commission;
  }

  updateCommission(commissionId: string, updates: Partial<Commission>): Commission | null {
    const index = this.commissions.findIndex(c => c.id === commissionId);
    if (index === -1) return null;
    this.commissions[index] = { ...this.commissions[index], ...updates, updatedAt: new Date() };
    return this.commissions[index];
  }

  calculateCommission(distributorId: string, productId: string, saleAmount: number): number {
    const commission = this.commissions.find(c =>
      c.distributorId === distributorId &&
      c.productId === productId &&
      c.isActive &&
      (!c.minSales || saleAmount >= c.minSales) &&
      (!c.maxSales || saleAmount <= c.maxSales)
    );
    if (!commission) return 0;
    return commission.type === 'percentage' ? (saleAmount * commission.value) / 100 : commission.value;
  }

  getDistributorCommissions(distributorId: string): Commission[] {
    return this.commissions.filter(c => c.distributorId === distributorId);
  }

  // ========== GESTION DES VENTES ==========
  recordSale(saleData: Omit<Sale, 'id' | 'commissionAmount' | 'saleDate'>): Sale {
    const commissionAmount = this.calculateCommission(saleData.distributorId, saleData.productId, saleData.totalAmount);
    const sale: Sale = {
      ...saleData,
      id: this.generateId(),
      commissionAmount,
      saleDate: new Date()
    };
    this.sales.push(sale);
    this.updateStockAfterSale(saleData.distributorId, saleData.productId, saleData.quantity);
    this.updateDistributorStats(saleData.distributorId, saleData.totalAmount, commissionAmount);
    return sale;
  }

  getDistributorSales(distributorId: string): Sale[] {
    return this.sales.filter(s => s.distributorId === distributorId);
  }

  getSalesStatistics(distributorId: string) {
    const sales = this.getDistributorSales(distributorId);
    const completed = sales.filter(s => s.status === 'completed');
    return {
      totalSales: completed.length,
      totalRevenue: completed.reduce((sum, s) => sum + s.totalAmount, 0),
      totalCommissions: completed.reduce((sum, s) => sum + s.commissionAmount, 0),
      averageSaleAmount: completed.length > 0
        ? completed.reduce((sum, s) => sum + s.totalAmount, 0) / completed.length
        : 0,
    };
  }

  // ========== GESTION DU STOCK ==========
  initializeStock(stockData: Omit<Stock, 'id' | 'availableQuantity' | 'lastUpdated'>): Stock {
    const stock: Stock = {
      ...stockData,
      id: this.generateId(),
      availableQuantity: stockData.currentLevel - stockData.reservedQuantity,
      lastUpdated: new Date()
    };
    this.stocks.push(stock);
    return stock;
  }

  getStockReport(distributorId: string) {
    const stocks = this.stocks.filter(s => s.distributorId === distributorId);
    return {
      totalProducts: stocks.length,
      lowStockItems: stocks.filter(s => s.currentLevel <= s.minLevel).length,
      outOfStockItems: stocks.filter(s => s.currentLevel === 0).length,
      totalValue: stocks.reduce((sum, s) => sum + s.currentLevel, 0),
    };
  }

  // ========== UTILITAIRES ==========
  private updateStockAfterSale(distributorId: string, productId: string, quantity: number): void {
    const stock = this.stocks.find(s => s.distributorId === distributorId && s.productId === productId);
    if (stock) {
      stock.currentLevel -= quantity;
      stock.availableQuantity = stock.currentLevel - stock.reservedQuantity;
      stock.lastUpdated = new Date();
    }
  }

  private updateDistributorStats(distributorId: string, saleAmount: number, commissionAmount: number): void {
    const distributor = this.distributors.find(d => d.id === distributorId);
    if (distributor) {
      distributor.totalSales += saleAmount;
      distributor.totalCommissions += commissionAmount;
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
