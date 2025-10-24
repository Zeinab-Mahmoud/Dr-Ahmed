export interface InvoiceDetail {
  id: string;
  العرض: number;
  التخانة: number;
  الطول: number;
  عدد_الامتار_الاجمالي: number;
  سعر_المتر: number;
  المكعب: number;
  الاجمالي: number;
  فصال?: number;
  سعر_المتر_بعد_الفصال?: number;
  مديونية?: number;
  الفرق?: number;
  عرض_السعر_المعدل?: boolean;
  نوع_السعر_المعدل?: 'فصال' | 'مديونية';
}

export interface InvoiceItem {
  id: string;
  النوع: string;
  البيان: string;
  العدد_الإجمالي: number;
  التفاصيل: InvoiceDetail[];
  إجمالي_الصنف: number;
}

export interface Invoice {
  id: string;
  رقم_الفاتورة: string;
  التاريخ: string;
  الوقت: string;
  اسم_العميل: string;
  رقم_الهاتف?: string;
  نوع_الفاتورة: 'وارد' | 'منصرف';
  العناصر: InvoiceItem[];
  مصاريف_النقل?: number;
  مصاريف_التنزيل?: number;
  إجمالي_المصاريف: number;
  الإجمالي_النهائي: number;
  حالة_الدفع: 'مدفوع' | 'غير مدفوع' | 'مدفوع جزئياً';
  المبلغ_المدفوع?: number;
  المبلغ_المتبقي?: number;
  ملاحظات?: string;
}

export interface Customer {
  id: string;
  الاسم: string;
  رقم_الهاتف?: string;
  العنوان?: string;
  إجمالي_المشتريات: number;
  إجمالي_المبيعات: number;
  الرصيد: number;
  تاريخ_آخر_معاملة: string;
}

export interface DebtRecord {
  id: string;
  اسم_العميل: string;
  رقم_الفاتورة: string;
  المبلغ: number;
  تاريخ_الاستحقاق: string;
  حالة_السداد: 'مسدد' | 'غير مسدد' | 'مسدد جزئياً';
  المبلغ_المسدد: number;
  المبلغ_المتبقي: number;
  نوع_الدين: 'دين' | 'مدان';
}

export interface InventoryItem {
  id: string;
  النوع: string;
  البيان: string;
  الكمية_المتاحة: number;
  متوسط_سعر_الشراء: number;
  متوسط_سعر_البيع: number;
  آخر_تحديث: string;
}

export interface WoodType {
  id: string;
  النوع: string;
  البيان: string;
}