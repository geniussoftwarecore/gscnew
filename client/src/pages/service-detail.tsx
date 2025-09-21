import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Smartphone, Shield, CheckCircle, Target, Palette, Globe, Plug, Store, Filter, Package, FileText, Settings, BookOpen, GraduationCap, BarChart3, Info, X, ChevronRight, Calendar, Code, Zap, HelpCircle, Layers, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import React, { useMemo, useState, useEffect, lazy, Suspense, useCallback } from "react";
import ConsolidatedERPNextV15Section from "@/components/erpnext/ConsolidatedERPNextV15Section";
import MobileAppPlanningSystem from "@/components/services/MobileAppPlanningSystem";

// Service interface
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  featured: string;
  technologies: string[];
  deliveryTime: string;
  startingPrice?: number;
}

// Service Subcategory interface
interface ServiceSubcategory {
  id: string;
  serviceId: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  pricing: string;
  timeline: Array<{ phase: string; note: string }>;
  technologies: string[];
  targetAudience: string;
  deliverables: string[];
  prerequisites: string;
  complexity: string;
  createdAt: Date;
  updatedAt: Date;
}

// App Card interface
interface AppCard {
  id: string;
  category: string;
  title: string;
  shortDesc: string;
  keyFeatures: string[];
  tag?: string;
  longDesc: string;
  stack: string[];
  integrations: string[];
  timeline: Array<{ phase: string; note: string }>;
  pricingNote: string;
  faqs: Array<{ q: string; a: string }>;
  images: string[];
  ctaLink: string;
}


// Web development service categories with interactive icons
const useWebCategories = () => {
  const { t } = useTranslation();
  
  return [
    { key: 'all', label: t('webPage.filters.all', 'جميع الأنواع') },
    { key: 'website', label: t('webPage.filters.website', 'المواقع الإلكترونية'), icon: Globe },
    { key: 'platform', label: t('webPage.filters.platform', 'المنصات الرقمية'), icon: Layers },
    { key: 'ecommerce', label: t('webPage.filters.ecommerce', 'التجارة الإلكترونية'), icon: ShoppingCart }
  ];
};

// Web development service specializations
const useWebServiceCards = () => {
  return [
    // Web Development Category (3 cards)
    { 
      id: 'web1', 
      category: 'website', 
      title: 'مواقع الشركات والأعمال', 
      shortDesc: 'مواقع احترافية تمثل هويتك التجارية بأفضل شكل', 
      keyFeatures: ['تصميم متجاوب', 'لوحة تحكم سهلة', 'محرك بحث محسن (SEO)', 'تكامل شبكات اجتماعية', 'دعم RTL كامل'], 
      tag: 'Professional',
      longDesc: 'مواقع شركات احترافية مصممة لتمثيل علامتك التجارية بأفضل شكل مع تجربة مستخدم متميزة',
      stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      integrations: ['Google Analytics', 'نماذج التواصل', 'خرائط Google', 'شبكات التواصل الاجتماعي'],
      timeline: [
        { phase: 'تحليل المتطلبات', note: 'دراسة الهوية التجارية والمتطلبات' },
        { phase: 'التصميم وتجربة المستخدم', note: 'تصميم واجهات احترافية' },
        { phase: 'التطوير والتكامل', note: 'بناء الموقع وربط الأنظمة' },
        { phase: 'الاختبار والتسليم', note: 'اختبار شامل وتدريب المستخدمين' }
      ],
      pricingNote: '',
      faqs: [
        { q: 'هل الموقع محسن لمحركات البحث؟', a: 'نعم، جميع مواقعنا محسنة بالكامل لمحركات البحث مع أفضل الممارسات.' },
        { q: 'هل يمكنني تعديل المحتوى بنفسي؟', a: 'نعم، نوفر لوحة تحكم سهلة تمكنك من تحديث المحتوى بدون خبرة تقنية.' }
      ],
      images: [],
      ctaLink: '/contact'
    },
    { 
      id: 'platform1', 
      category: 'platform', 
      title: 'منصات إدارة المحتوى', 
      shortDesc: 'منصات قوية لإدارة وعرض المحتوى', 
      keyFeatures: ['محرر نصوص متقدم', 'إدارة المستخدمين', 'نظام أذونات', 'تصدير المحتوى', 'تحليلات المحتوى'], 
      tag: 'Platform',
      longDesc: 'منصات إدارة محتوى قوية ومرنة تتيح لك السيطرة الكاملة على المحتوى والمستخدمين',
      stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      integrations: ['أنظمة الدفع', 'خدمات التخزين السحابي', 'تحليلات المحتوى', 'شبكات التوصيل'],
      timeline: [
        { phase: 'تحليل المتطلبات', note: 'دراسة احتياجات المنصة' },
        { phase: 'التصميم وتجربة المستخدم', note: 'تصميم واجهة إدارية قوية' },
        { phase: 'التطوير والتكامل', note: 'بناء النظام وربط الأنظمة' },
        { phase: 'الاختبار والتسليم', note: 'اختبار شامل وتدريب المدراء' }
      ],
      pricingNote: '',
      faqs: [
        { q: 'كم يستغرق تطوير المنصة؟', a: '6-12 أسبوع حسب تعقيد المتطلبات والميزات المطلوبة.' }
      ],
      images: [],
      ctaLink: '/contact'
    },
    { 
      id: 'ecommerce1', 
      category: 'ecommerce', 
      title: 'متاجر إلكترونية متقدمة', 
      shortDesc: 'متاجر إلكترونية قوية مع ميزات تجارية متطورة', 
      keyFeatures: ['سلة شراء ذكية', 'بوابات دفع متعددة', 'إدارة مخزون', 'تقارير مبيعات', 'برامج ولاء العملاء'], 
      longDesc: 'متاجر إلكترونية احترافية مع جميع الميزات المطلوبة لنجاح تجارتك الإلكترونية',
      stack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
      integrations: ['بوابات الدفع المحلية والعالمية', 'خدمات الشحن', 'إدارة المخزون', 'تحليلات المبيعات'],
      timeline: [
        { phase: 'تحليل المتطلبات', note: 'دراسة المنتجات ونموذج العمل' },
        { phase: 'التصميم وتجربة المستخدم', note: 'تصميم تجربة تسوق مميزة' },
        { phase: 'التطوير والتكامل', note: 'بناء المتجر وربط الأنظمة' },
        { phase: 'الاختبار والتسليم', note: 'اختبار شامل وإطلاق المتجر' }
      ],
      pricingNote: '',
      faqs: [
        { q: 'ما هي بوابات الدفع المدعومة؟', a: 'ندعم جميع بوابات الدفع المحلية والعالمية مثل فيزا، ماستركارد، مدى، والتحويل البنكي.' }
      ],
      images: [],
      ctaLink: '/contact'
    },



  ];
};

export default function ServiceDetailClean() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { lang, dir } = useLanguage();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAppDetails, setSelectedAppDetails] = useState<AppCard | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(8);

  // Use the web service categories and cards
  const categories = useWebCategories();
  const appCards = useWebServiceCards();

  // Handle deep linking with hash fragments
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#details-')) {
        const serviceId = hash.replace('#details-', '');
        const service = appCards.find(card => card.id === serviceId);
        if (service) {
          setSelectedAppDetails(service);
          setIsDetailsModalOpen(true);
        }
      } else if (isDetailsModalOpen) {
        setIsDetailsModalOpen(false);
        setSelectedAppDetails(null);
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isDetailsModalOpen]);

  // Handle modal close - update URL hash
  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAppDetails(null);
    // Remove hash from URL without triggering navigation
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Handle view details click
  const handleViewDetails = (service: AppCard) => {
    setSelectedAppDetails(service);
    setIsDetailsModalOpen(true);
    // Add hash to URL for deep linking
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#details-${service.id}`);
  };

  // App Details Modal Component
  const AppDetailsModal = () => {
    if (!selectedAppDetails || !isDetailsModalOpen) return null;

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto" 
          dir={dir}
          aria-labelledby={`details-title-${selectedAppDetails.id}`}
          aria-describedby={`details-description-${selectedAppDetails.id}`}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle 
              id={`details-title-${selectedAppDetails.id}`}
              className="text-xl font-bold text-gray-900 dark:text-white pr-4"
            >
              {selectedAppDetails.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={t('webPage.details.close', 'إغلاق')}
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('webPage.details.overview', 'نظرة عامة')}</h3>
              </div>
              <p 
                id={`details-description-${selectedAppDetails.id}`}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {selectedAppDetails.longDesc}
              </p>
            </motion.div>

            {/* Key Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('webPage.details.keyFeatures', 'الميزات الرئيسية')}</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(Array.isArray(selectedAppDetails.keyFeatures) ? selectedAppDetails.keyFeatures : [selectedAppDetails.keyFeatures]).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tech Stack & Integrations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Tech Stack */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('webPage.details.stack', 'التقنيات المستخدمة')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedAppDetails.stack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Plug className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('webPage.details.integrations', 'التكاملات')}</h3>
                </div>
                <ul className="space-y-1">
                  {selectedAppDetails.integrations.map((integration, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <ChevronRight className={cn("w-4 h-4 text-gray-400", dir === 'rtl' && "rotate-180")} />
                      <span>{integration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Timeline Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('webPage.details.timeline', 'المدة المتوقعة والخط الزمني')}</h3>
              </div>
              <div className="space-y-3">
                {selectedAppDetails.timeline.map((phase, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{phase.phase}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{phase.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>


            {/* FAQs Section */}
            {selectedAppDetails.faqs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('webPage.details.faqs', 'أسئلة شائعة')}</h3>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {selectedAppDetails.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-right">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-gray-700 dark:text-gray-300">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  setLocation('/contact');
                  handleCloseModal();
                }}
                data-testid={`button-start-now-${selectedAppDetails.id}`}
              >
                {t('webPage.details.startNow', 'ابدأ الآن')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setLocation(`/contact?service=web-development&app=${encodeURIComponent(selectedAppDetails.title)}&category=${selectedAppDetails.category}&serviceName=${encodeURIComponent(service?.title || 'تطوير المواقع والمنصات')}`);
                  handleCloseModal();
                }}
                data-testid={`button-request-modal-${selectedAppDetails.id}`}
              >
                {t('webPage.details.requestService', 'اطلب الخدمة')}
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Optimized service query - fetch specific service by ID
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: ['/api/services', id],
    queryFn: async () => {
      const response = await fetch(`/api/services/${id}`);
      if (!response.ok) {
        throw new Error('Service not found');
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Service subcategories query - fetch subcategories for this service
  const { data: serviceSubcategories, isLoading: subcategoriesLoading } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories/by-service', id],
    queryFn: async () => {
      const response = await fetch(`/api/service-subcategories/by-service/${id}`);
      if (!response.ok) {
        return []; // Return empty array if no subcategories found
      }
      return response.json();
    },
    enabled: !!id && !!service
  });

  // Filter cards based on selected category with performance optimization
  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') {
      return appCards;
    }
    return appCards.filter(card => card.category === selectedCategory);
  }, [selectedCategory, appCards]);

  // Optimize category change handler
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Performance optimization callbacks
  const loadMoreCards = useCallback(() => {
    setVisibleCards(prev => Math.min(prev + 8, filteredCards.length));
  }, [filteredCards.length]);

  const displayedCards = useMemo(() => {
    return filteredCards.slice(0, visibleCards);
  }, [filteredCards, visibleCards]);

  // Reset visible cards when category changes
  useEffect(() => {
    setVisibleCards(8);
  }, [selectedCategory]);

  // Check if this is a mobile app development service
  const isMobileAppService = service?.category === 'mobile';

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'ar' ? 'الخدمة غير موجودة' : 'Service Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {lang === 'ar' ? 'عذراً، لم نتمكن من العثور على الخدمة المطلوبة' : 'Sorry, we could not find the requested service'}
          </p>
          <Button onClick={() => setLocation('/services')}>
            <ArrowLeft className={cn("w-4 h-4 mr-2", dir === 'rtl' && "rotate-180 mr-0 ml-2")} />
            {lang === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Button>
        </div>
      </div>
    );
  }

  // If not mobile app service, show the ERPNext section or basic service view
  if (!isMobileAppService) {
    const webIcons = [
      { Icon: Globe, label: lang === 'ar' ? 'المواقع الإلكترونية' : 'Websites', delay: 0.1 },
      { Icon: Layers, label: lang === 'ar' ? 'المنصات الرقمية' : 'Digital Platforms', delay: 0.2 },
      { Icon: ShoppingCart, label: lang === 'ar' ? 'المتاجر الإلكترونية' : 'E-commerce', delay: 0.3 }
    ];
    
    return (
      <>
        <SEOHead
          title={`${service.title} - ${lang === 'ar' ? 'جينيوس سوفتوير' : 'Genius Software'}`}
          description={service.description}
          keywords={service.technologies?.join(', ')}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
          
          {/* ERPNext v15 Section - Only show for ERP services */}
          {service && service.category === 'erp' && (
            <ConsolidatedERPNextV15Section />
          )}

          {/* Back Button */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/services')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className={cn("w-4 h-4 mr-2", dir === 'rtl' && "rotate-180 mr-0 ml-2")} />
                {lang === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
              </Button>
            </motion.div>
          </div>

          {/* Basic Service Display */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                {/* Interactive Icons */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  {webIcons.map(({ Icon, label, delay }, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay }}
                      className="group cursor-pointer"
                      data-testid={`icon-${index === 0 ? 'websites' : index === 1 ? 'platforms' : 'ecommerce'}`}
                    >
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30">
                        <Icon className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-primary-dark" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {label}
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  {service.description}
                </p>

                {/* Technologies */}
                {service.technologies && service.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {service.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Delivery Time */}
                {service.deliveryTime && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>{service.deliveryTime}</span>
                  </div>
                )}
              </motion.div>

              {/* Service Subcategories - Show for specific services only */}
              {service && ['mobile', 'web', 'desktop', 'design', 'marketing'].includes(service.category) && 
               serviceSubcategories && serviceSubcategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    {lang === 'ar' ? 'أنواع وتخصصات الخدمة' : 'Service Types & Specializations'}
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {serviceSubcategories.map((subcategory, index) => (
                      <motion.div
                        key={subcategory.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700"
                        data-testid={`subcategory-${subcategory.id}`}
                      >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {subcategory.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                          {subcategory.description}
                        </p>

                        {/* Key Features */}
                        {subcategory.features && subcategory.features.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              {lang === 'ar' ? 'المميزات الرئيسية:' : 'Key Features:'}
                            </h4>
                            <ul className="space-y-1">
                              {subcategory.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Technologies */}
                        {subcategory.technologies && subcategory.technologies.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {subcategory.technologies.slice(0, 3).map((tech, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timeline and Pricing */}
                        <div className="space-y-2">
                          {subcategory.timeline && subcategory.timeline.length > 0 && (
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <Calendar className="w-3 h-3 mr-2" />
                              <span>{subcategory.timeline.length} مراحل - {subcategory.timeline.map(t => t.note).join(', ')}</span>
                            </div>
                          )}
                          
                          {subcategory.pricing && (
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                              <Target className="w-3 h-3 mr-2" />
                              {subcategory.pricing}
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-600">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            onClick={() => setLocation(`/contact?service=${service.id}&subcategory=${subcategory.id}`)}
                            data-testid={`button-request-${subcategory.id}`}
                          >
                            {lang === 'ar' ? 'اطلب عرض سعر' : 'Request Quote'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Service Features/Content would go here */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  {lang === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
                  {lang === 'ar' 
                    ? 'تواصل معنا للحصول على تفاصيل أكثر حول هذه الخدمة والبدء في مشروعك.'
                    : 'Contact us to get more details about this service and start your project.'
                  }
                </p>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => setLocation(`/contact?service=${service.id}`)}
                    className="mr-4"
                  >
                    {lang === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project'}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation('/services')}
                  >
                    {lang === 'ar' ? 'تصفح خدمات أخرى' : 'Browse Other Services'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mobile App Development Service Page  
  return (
    <>
      <SEOHead
        title="تطوير تطبيقات الموبايل - خدماتنا | Genius Software Core"
        description="خطط مشروع تطبيقك بكل تفاصيله من خلال نظامنا التفاعلي المتطور لتطوير تطبيقات الموبايل"
        keywords="تطوير تطبيقات، أندرويد، iOS، تطبيقات جوال، React Native، Flutter"
      />
      
      <MobileAppPlanningSystem />
    </>
  );
}
