import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Footer() {
  const handleDownload = () => {
    // Create a download link for the compressed file
    const link = document.createElement('a');
    link.href = '/arabic-wood-trading-system.tar.gz';
    link.download = 'arabic-wood-trading-system.tar.gz';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-auto rounded-none border-l-0 border-r-0 border-b-0 bg-gradient-to-r from-blue-50 to-green-50">
      <div className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
            <div className="text-2xl font-bold text-blue-800">شركة العامر</div>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-lg text-green-700 font-semibold">لتجارة الأخشاب</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="space-y-1">
              <div className="font-semibold text-blue-700">معلومات الاتصال</div>
              <div>📞 +20 123 456 7890</div>
              <div>📧 info@alamer-wood.com</div>
            </div>
            
            <div className="space-y-1">
              <div className="font-semibold text-blue-700">العنوان</div>
              <div>📍 شارع التجارة الرئيسي</div>
              <div>القاهرة، مصر</div>
            </div>
            
            <div className="space-y-1">
              <div className="font-semibold text-blue-700">ساعات العمل</div>
              <div>🕘 السبت - الخميس: 8:00 ص - 6:00 م</div>
              <div>🕘 الجمعة: مغلق</div>
            </div>
          </div>
          
          {/* Download Section */}
          <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-lg border border-blue-200">
            <div className="flex flex-col items-center space-y-2">
              <div className="font-semibold text-blue-800">تحميل النظام</div>
              <p className="text-sm text-muted-foreground text-center">
                حمل النظام كاملاً لتنصيبه على الخادم الخاص بك
              </p>
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                size="sm"
              >
                <Download className="ml-2 h-4 w-4" />
                تحميل النظام (tar.gz)
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
            <div>© 2024 شركة العامر لتجارة الأخشاب. جميع الحقوق محفوظة.</div>
            <div className="mt-2 md:mt-0">نظام إدارة المخزون والفواتير</div>
          </div>
        </div>
      </div>
    </Card>
  );
}