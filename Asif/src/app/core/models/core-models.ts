export interface User {
  userID: string;
  userName: string;
  password?: string; // Optional for client-side use
  role: 'admin' | 'staff';
}

export interface Customer {
  customerID: string;
  name: string;
  contactInfo: string;
  loyaltyPoints: number;
}

export interface SalesReport {
  reportID: string;
  date: Date;
  totalSales: number;
  totalTransactions: number;
  userID: string;
}

export interface Transaction {
  transactionID: string;
  userID: string;
  customerID: string;
  date: Date;
  totalAmount: number;
  details?: TransactionDetail[];
}

export interface TransactionDetail {
  transactionDetailID: string;
  transactionID: string;
  menuItemID: string;
  quantity: number;
  price: number;
}

export interface MenuItem {
  menuItemID: string;
  name: string;
  description: string;
  price: number;
  categoryID: string;
  imageUrl?: string;
  isAvailable?: boolean; // Keep for UI convenience
}

export interface Category {
  categoryID: string;
  categoryName: string;
}

export interface MenuItemModification {
  modificationID: string;
  menuItemID: string;
  modificationName: string;
  additionalCost: number;
}

export interface RecipeIngredient {
  recipeID: string;
  menuItemID: string;
  inventoryItemID: string;
  ingredientQuantity: number;
  inventoryItem?: InventoryItem;
}

export interface RecipeIngredientRequest {
  inventoryItemID: string;
  ingredientQuantity: number;
}

export interface ProductDialogResult {
  product: Omit<MenuItem, 'menuItemID'>;
  recipeIngredients: RecipeIngredientRequest[];
}

export interface InventoryItem {
  inventoryItemID: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit?: string; // Keep for UI convenience
  baseUnit?: string;
  status?: 'OK' | 'LOW' | 'OUT OF STOCK' | string;
}

export interface Restock {
  restockID: string;
  inventoryItemID: string;
  quantity: number;
  date: Date;
}

// Keeping these for context/compatibility during migration if needed, but they should be phased out
export type Product = MenuItem;
export type Order = Transaction;
export type OrderItem = TransactionDetail;

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  bestSeller: string;
}
