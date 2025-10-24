import { Invoice, Customer, DebtRecord, InventoryItem, WoodType, InvoiceDetail } from '@/types';

// Storage keys
const INVOICES_KEY = 'alamer_invoices';
const CUSTOMERS_KEY = 'alamer_customers';
const DEBTS_KEY = 'alamer_debts';
const INVENTORY_KEY = 'alamer_inventory';
const WOOD_TYPES_KEY = 'alamer_wood_types';

// Invoice functions
export const loadInvoices = (): Invoice[] => {
  try {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading invoices:', error);
    return [];
  }
};

export const saveInvoices = (invoices: Invoice[]): void => {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    // Update related data
    updateCustomersFromInvoices(invoices);
    updateDebtsFromInvoices(invoices);
    updateInventoryFromInvoices(invoices);
  } catch (error) {
    console.error('Error saving invoices:', error);
  }
};

// Customer functions
export const loadCustomers = (): Customer[] => {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
};

export const saveCustomers = (customers: Customer[]): void => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers:', error);
  }
};

// Debt functions
export const loadDebts = (): DebtRecord[] => {
  try {
    const data = localStorage.getItem(DEBTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading debts:', error);
    return [];
  }
};

export const saveDebts = (debts: DebtRecord[]): void => {
  try {
    localStorage.setItem(DEBTS_KEY, JSON.stringify(debts));
  } catch (error) {
    console.error('Error saving debts:', error);
  }
};

// Inventory functions
export const loadInventory = (): InventoryItem[] => {
  try {
    const data = localStorage.getItem(INVENTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading inventory:', error);
    return [];
  }
};

export const saveInventory = (inventory: InventoryItem[]): void => {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch (error) {
    console.error('Error saving inventory:', error);
  }
};

// Wood types functions
export const loadWoodTypes = (): WoodType[] => {
  try {
    const data = localStorage.getItem(WOOD_TYPES_KEY);
    const defaultTypes = [
      { id: '1', النوع: 'خشب زان', البيان: 'خشب زان طبيعي' },
      { id: '2', النوع: 'خشب صنوبر', البيان: 'خشب صنوبر مستورد' },
      { id: '3', النوع: 'خشب موسكي', البيان: 'خشب موسكي روسي' },
      { id: '4', النوع: 'خشب أرو', البيان: 'خشب أرو أوروبي' },
      { id: '5', النوع: 'خشب سويدي', البيان: 'خشب سويدي مستورد' }
    ];
    return data ? JSON.parse(data) : defaultTypes;
  } catch (error) {
    console.error('Error loading wood types:', error);
    return [];
  }
};

export const saveWoodTypes = (woodTypes: WoodType[]): void => {
  try {
    localStorage.setItem(WOOD_TYPES_KEY, JSON.stringify(woodTypes));
  } catch (error) {
    console.error('Error saving wood types:', error);
  }
};

// Update functions
const updateCustomersFromInvoices = (invoices: Invoice[]): void => {
  const customers = loadCustomers();
  const customerMap = new Map(customers.map(c => [c.الاسم, c]));

  invoices.forEach(invoice => {
    let customer = customerMap.get(invoice.اسم_العميل);
    
    if (!customer) {
      customer = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        الاسم: invoice.اسم_العميل,
        رقم_الهاتف: invoice.رقم_الهاتف,
        العنوان: '',
        إجمالي_المشتريات: 0,
        إجمالي_المبيعات: 0,
        الرصيد: 0,
        تاريخ_آخر_معاملة: invoice.التاريخ
      };
      customerMap.set(invoice.اسم_العميل, customer);
    }

    if (invoice.نوع_الفاتورة === 'وارد') {
      customer.إجمالي_المشتريات += invoice.الإجمالي_النهائي;
    } else {
      customer.إجمالي_المبيعات += invoice.الإجمالي_النهائي;
    }

    customer.الرصيد = customer.إجمالي_المبيعات - customer.إجمالي_المشتريات;
    customer.تاريخ_آخر_معاملة = invoice.التاريخ;
  });

  saveCustomers(Array.from(customerMap.values()));
};

const updateDebtsFromInvoices = (invoices: Invoice[]): void => {
  const debts: DebtRecord[] = [];

  invoices.forEach(invoice => {
    if (invoice.حالة_الدفع === 'غير مدفوع' || invoice.حالة_الدفع === 'مدفوع جزئياً') {
      const remainingAmount = invoice.المبلغ_المتبقي || invoice.الإجمالي_النهائي;
      const paidAmount = invoice.المبلغ_المدفوع || 0;

      debts.push({
        id: `debt_${invoice.id}`,
        اسم_العميل: invoice.اسم_العميل,
        رقم_الفاتورة: invoice.رقم_الفاتورة,
        المبلغ: invoice.الإجمالي_النهائي,
        تاريخ_الاستحقاق: invoice.التاريخ,
        حالة_السداد: invoice.حالة_الدفع === 'غير مدفوع' ? 'غير مسدد' : 'مسدد جزئياً',
        المبلغ_المسدد: paidAmount,
        المبلغ_المتبقي: remainingAmount,
        نوع_الدين: invoice.نوع_الفاتورة === 'منصرف' ? 'دين' : 'مدان'
      });
    }
  });

  saveDebts(debts);
};

const updateInventoryFromInvoices = (invoices: Invoice[]): void => {
  const inventory = loadInventory();
  const inventoryMap = new Map(inventory.map(item => [`${item.النوع}_${item.البيان}`, item]));

  invoices.forEach(invoice => {
    invoice.العناصر.forEach(element => {
      const key = `${element.النوع}_${element.البيان}`;
      let item = inventoryMap.get(key);

      if (!item) {
        item = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          النوع: element.النوع,
          البيان: element.البيان,
          الكمية_المتاحة: 0,
          متوسط_سعر_الشراء: 0,
          متوسط_سعر_البيع: 0,
          آخر_تحديث: invoice.التاريخ
        };
        inventoryMap.set(key, item);
      }

      const totalCubic = element.التفاصيل.reduce((sum, detail) => sum + detail.المكعب, 0);
      const avgPrice = element.التفاصيل.reduce((sum, detail) => sum + detail.سعر_المتر, 0) / element.التفاصيل.length;

      if (invoice.نوع_الفاتورة === 'وارد') {
        item.الكمية_المتاحة += totalCubic;
        item.متوسط_سعر_الشراء = avgPrice;
      } else {
        item.الكمية_المتاحة -= totalCubic;
        item.متوسط_سعر_البيع = avgPrice;
      }

      item.آخر_تحديث = invoice.التاريخ;
    });
  });

  saveInventory(Array.from(inventoryMap.values()));
};

// Excel export function
export const exportToExcel = (invoices: Invoice[], type: 'وارد' | 'منصرف' | 'all' = 'all') => {
  const filteredInvoices = type === 'all' ? invoices : invoices.filter(inv => inv.نوع_الفاتورة === type);
  
  // Create CSV content
  let csvContent = '\uFEFF'; // BOM for Arabic support
  csvContent += 'رقم الفاتورة,التاريخ,العميل,النوع,الإجمالي,حالة الدفع,المبلغ المدفوع,المبلغ المتبقي\n';
  
  filteredInvoices.forEach(invoice => {
    csvContent += `${invoice.رقم_الفاتورة},${invoice.التاريخ},${invoice.اسم_العميل},${invoice.نوع_الفاتورة},${invoice.الإجمالي_النهائي},${invoice.حالة_الدفع},${invoice.المبلغ_المدفوع || 0},${invoice.المبلغ_المتبقي || 0}\n`;
  });

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `فواتير_${type}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2
  }).format(amount);
};

export const generateInvoiceNumber = (type: 'وارد' | 'منصرف'): string => {
  const invoices = loadInvoices();
  const typeInvoices = invoices.filter(inv => inv.نوع_الفاتورة === type);
  const nextNumber = typeInvoices.length + 1;
  const prefix = type === 'وارد' ? 'IN' : 'OUT';
  return `${prefix}-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
};

export const calculateDetailTotal = (detail: InvoiceDetail): number => {
  const cubic = detail.العرض * detail.التخانة * detail.الطول * detail.عدد_الامتار_الاجمالي;
  return cubic * detail.سعر_المتر;
};

export const calculateAdjustedPrice = (detail: InvoiceDetail): number => {
  const cubic = detail.العرض * detail.التخانة * detail.الطول * detail.عدد_الامتار_الاجمالي;
  if (detail.فصال && cubic > 0) {
    return detail.فصال / cubic;
  }
  return 0;
};

export const calculateDifference = (detail: InvoiceDetail): number => {
  const total = calculateDetailTotal(detail);
  if (detail.نوع_السعر_المعدل === 'فصال' && detail.فصال) {
    return total - detail.فصال;
  } else if (detail.نوع_السعر_المعدل === 'مديونية' && detail.مديونية) {
    return total - detail.مديونية;
  }
  return 0;
};