import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Smartphone, Shield, CheckCircle, Target, Palette, Globe, Plug, Store, Filter, Package, FileText, Settings, BookOpen, GraduationCap, BarChart3, Info, X, ChevronRight, Calendar, Code, Zap, HelpCircle, Layers, ShoppingCart, Users, Building, GraduationCapIcon, Upload, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import React, { useMemo, useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import ConsolidatedERPNextV15Section from "@/components/erpnext/ConsolidatedERPNextV15Section";
import MobileAppPlanningSystem from "@/components/services/MobileAppPlanningSystem";
import { projectRequestSchema, type ProjectRequestFormData } from "@shared/schema";

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
                        <Icon className="w-8 h-8 text-primary transition-colors duration-300 group-hover:text-primary" />
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

              {/* Project Request Wizard */}
              <ProjectRequestWizard serviceId={service.id} />

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

// Project Request Wizard Component
interface ProjectRequestWizardProps {
  serviceId: string;
}

const ProjectRequestWizard: React.FC<ProjectRequestWizardProps> = ({ serviceId }) => {
  const { lang, dir } = useLanguage();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProjectRequestFormData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      category: "commercial",
      buildKind: "website",
      features: [],
      ideaSummary: "",
      attachments: []
    }
  });

  const watchCategory = form.watch("category");
  const watchBuildKind = form.watch("buildKind");

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      const attachments = form.getValues("attachments") || [];
      attachments.forEach(attachment => {
        if (attachment.tempUrl) {
          URL.revokeObjectURL(attachment.tempUrl);
        }
      });
    };
  }, [form]);

  // Available features based on build kind
  const getAvailableFeatures = () => {
    const baseFeatures = [
      { id: "auth_roles", label: lang === 'ar' ? "حسابات وصلاحيات أدوار" : "User Auth & Roles", desc: lang === 'ar' ? "نظام المستخدمين والأذونات" : "User management system" },
      { id: "cms_core", label: lang === 'ar' ? "إدارة محتوى بسيط" : "Simple CMS", desc: lang === 'ar' ? "إدارة وتحرير المحتوى" : "Content management" },
      { id: "i18n", label: lang === 'ar' ? "تعدد اللغات" : "Multi-language", desc: lang === 'ar' ? "عربي/إنجليزي" : "Arabic/English" },
      { id: "dark_mode", label: lang === 'ar' ? "وضع ليلي/نهاري" : "Dark/Light Mode", desc: lang === 'ar' ? "تبديل الألوان" : "Theme switching" },
      { id: "responsive_ui", label: lang === 'ar' ? "استجابة كاملة للأجهزة" : "Responsive Design", desc: lang === 'ar' ? "يعمل على جميع الأجهزة" : "All device compatibility" },
      { id: "seo_basics", label: lang === 'ar' ? "تحسينات SEO أساسية" : "Basic SEO", desc: lang === 'ar' ? "محسن لمحركات البحث" : "Search engine optimization" },
      { id: "analytics_dashboard", label: lang === 'ar' ? "تحليلات ولوحة مؤشرات" : "Analytics Dashboard", desc: lang === 'ar' ? "إحصائيات مفصلة" : "Detailed analytics" },
      { id: "forms_contact", label: lang === 'ar' ? "نماذج وتواصل" : "Forms & Contact", desc: lang === 'ar' ? "نماذج اتصال واشتراك" : "Contact & subscription forms" },
      { id: "site_search", label: lang === 'ar' ? "بحث داخل الموقع" : "Site Search", desc: lang === 'ar' ? "بحث في المحتوى" : "Content search" },
      { id: "integrations", label: lang === 'ar' ? "تكاملات API وخدمات خارجية" : "API Integrations", desc: lang === 'ar' ? "ربط مع خدمات خارجية" : "External service integrations" },
      { id: "security_basics", label: lang === 'ar' ? "أمان أساسي" : "Basic Security", desc: lang === 'ar' ? "حماية النماذج والمعدلات" : "Form protection & rate limiting" },
      { id: "perf_caching", label: lang === 'ar' ? "أداء وتخزين مؤقت" : "Performance & Caching", desc: lang === 'ar' ? "تحسين السرعة" : "Speed optimization" }
    ];

    const ecomFeatures = [
      { id: "ecom_core", label: lang === 'ar' ? "منتجات وسلة ودفع/شحن" : "Products, Cart & Payment", desc: lang === 'ar' ? "نظام التجارة الإلكترونية" : "E-commerce system" }
    ];

    const platformFeatures = [
      { id: "platform_modules", label: lang === 'ar' ? "وحدات/أدوار/تدفقات عمل" : "Modules & Workflows", desc: lang === 'ar' ? "إدارة متقدمة للمنصة" : "Advanced platform management" }
    ];

    let features = [...baseFeatures];
    if (watchBuildKind === "ecommerce") features.push(...ecomFeatures);
    if (watchBuildKind === "platform") features.push(...platformFeatures);

    return features;
  };

  // Submit handler
  const submitMutation = useMutation({
    mutationFn: async (data: ProjectRequestFormData) => {
      const requestData = {
        serviceId,
        title: `طلب ${data.buildKind === 'website' ? 'موقع' : data.buildKind === 'ecommerce' ? 'متجر إلكتروني' : 'منصة'} - ${data.category === 'commercial' ? 'تجاري' : data.category === 'educational' ? 'تعليمي' : 'آخر'}`,
        description: data.ideaSummary,
        requirements: {
          category: data.category,
          categoryOtherNote: data.categoryOtherNote,
          buildKind: data.buildKind,
          features: data.features,
          clientOptions: {
            targetAudience: data.targetAudience,
            domain: data.domain,
            hasHosting: data.hasHosting
          },
          attachments: data.attachments,
          submittedAt: new Date().toISOString(),
          clientMeta: {
            locale: lang,
            rtl: dir === 'rtl',
            userAgent: navigator.userAgent
          }
        }
      };

      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['/api/service-requests'] });
      
      toast({
        title: lang === 'ar' ? "تم إرسال الطلب بنجاح" : "Request submitted successfully",
        description: lang === 'ar' ? "سنتواصل معك قريباً" : "We'll get back to you soon"
      });
      setIsOpen(false);
      form.reset();
      setCurrentStep(1);
    },
    onError: (error) => {
      console.error("Submission error:", error);
      // Fallback: save to localStorage and open mailto
      const requestData = form.getValues();
      localStorage.setItem("gsc_web_request_draft", JSON.stringify(requestData));
      
      const mailtoSubject = encodeURIComponent(lang === 'ar' ? 'طلب مشروع جديد - تطوير المواقع والمنصات' : 'New Project Request - Web & Platform Development');
      const mailtoBody = encodeURIComponent(`
${lang === 'ar' ? 'تفاصيل الطلب:' : 'Request Details:'}

${lang === 'ar' ? 'فئة المشروع:' : 'Project Category:'} ${encodeURIComponent(requestData.category)}
${lang === 'ar' ? 'نوع التنفيذ:' : 'Build Type:'} ${encodeURIComponent(requestData.buildKind)}
${lang === 'ar' ? 'الميزات المطلوبة:' : 'Required Features:'} ${encodeURIComponent(requestData.features.join(', '))}
${lang === 'ar' ? 'وصف الفكرة:' : 'Idea Description:'} ${encodeURIComponent(requestData.ideaSummary)}

${requestData.targetAudience ? `${lang === 'ar' ? 'الجمهور المستهدف:' : 'Target Audience:'} ${encodeURIComponent(requestData.targetAudience)}` : ''}
${requestData.domain ? `${lang === 'ar' ? 'النطاق:' : 'Domain:'} ${encodeURIComponent(requestData.domain)}` : ''}
      `);
      
      window.open(`mailto:info@geniussoftware.co?subject=${mailtoSubject}&body=${mailtoBody}`);
      
      toast({
        title: lang === 'ar' ? "تم فتح البريد الإلكتروني" : "Email opened",
        description: lang === 'ar' ? "يرجى إرسال البريد لإكمال الطلب" : "Please send the email to complete your request"
      });
    }
  });

  // Step validation
  const validateCurrentStep = () => {
    const formValues = form.getValues();
    
    switch (currentStep) {
      case 1:
        // Step 1: Category and build type are required
        // If category is "other", categoryOtherNote is also required
        const categoryValid = formValues.category && formValues.buildKind;
        const otherNoteValid = formValues.category !== "other" || (formValues.categoryOtherNote && formValues.categoryOtherNote.trim().length > 0);
        return categoryValid && otherNoteValid;
      case 2:
        // Step 2: At least one feature must be selected
        return formValues.features && formValues.features.length > 0;
      case 3:
        // Step 3: Idea summary is required (minimum 20 characters)
        return formValues.ideaSummary && formValues.ideaSummary.length >= 20;
      case 4:
        // Step 4: Review step - all previous validations should pass
        const step1Valid = formValues.category && formValues.buildKind && 
                          (formValues.category !== "other" || (formValues.categoryOtherNote && formValues.categoryOtherNote.trim().length > 0));
        const step2Valid = formValues.features && formValues.features.length > 0;
        const step3Valid = formValues.ideaSummary && formValues.ideaSummary.length >= 20;
        return step1Valid && step2Valid && step3Valid;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      // Trigger form validation to show errors
      form.trigger();
      toast({
        title: lang === 'ar' ? "يرجى إكمال الحقول المطلوبة" : "Please complete required fields",
        description: lang === 'ar' ? "تأكد من ملء جميع الحقول المطلوبة قبل المتابعة" : "Make sure to fill all required fields before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (data: ProjectRequestFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'ابدأ خطة طلب مشروعك' : 'Start Your Project Request'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 'احصل على عرض سعر مخصص لمشروعك من خلال تحديد متطلباتك بدقة' : 'Get a customized quote for your project by specifying your requirements accurately'}
        </p>
      </div>

      {!isOpen && (
        <div className="text-center">
          <Button 
            onClick={() => setIsOpen(true)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            data-testid="button-start-wizard"
          >
            <FileText className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
            {lang === 'ar' ? 'ابدأ طلبك الآن' : 'Start Your Request'}
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {lang === 'ar' ? 'خطة طلب المشروع' : 'Project Request Wizard'}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      currentStep >= step ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    )}
                    data-testid={`step-indicator-${step}`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={cn(
                      "w-12 h-1 mx-2",
                      currentStep > step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" data-testid="progress-bar" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Step 1: Project Category & Build Type */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">
                    {lang === 'ar' ? 'فئة ونوع المشروع' : 'Project Category & Type'}
                  </h3>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'الفئة الرئيسية للمشروع' : 'Main Project Category'}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <RadioGroupItem value="commercial" id="commercial" data-testid="radio-category-commercial" />
                              <Label htmlFor="commercial" className="flex items-center cursor-pointer">
                                <Building className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
                                {lang === 'ar' ? 'تجاري' : 'Commercial'}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <RadioGroupItem value="educational" id="educational" data-testid="radio-category-educational" />
                              <Label htmlFor="educational" className="flex items-center cursor-pointer">
                                <GraduationCap className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
                                {lang === 'ar' ? 'تعليمي' : 'Educational'}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <RadioGroupItem value="other" id="other" data-testid="radio-category-other" />
                              <Label htmlFor="other" className="flex items-center cursor-pointer">
                                <Users className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
                                {lang === 'ar' ? 'أخرى' : 'Other'}
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchCategory === "other" && (
                    <FormField
                      control={form.control}
                      name="categoryOtherNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === 'ar' ? 'وصف الفئة' : 'Category Description'}</FormLabel>
                          <FormControl>
                            <Input placeholder={lang === 'ar' ? 'اكتب وصف الفئة...' : 'Describe the category...'} {...field} data-testid="input-category-other" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="buildKind"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'نوع التنفيذ' : 'Build Type'}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <RadioGroupItem value="website" id="website" data-testid="radio-build-website" />
                              <Label htmlFor="website" className="flex items-center cursor-pointer">
                                <Globe className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
                                {lang === 'ar' ? 'موقع ويب' : 'Website'}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <RadioGroupItem value="ecommerce" id="ecommerce" data-testid="radio-build-ecommerce" />
                              <Label htmlFor="ecommerce" className="flex items-center cursor-pointer">
                                <ShoppingCart className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
                                {lang === 'ar' ? 'متجر إلكتروني' : 'E-commerce'}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <RadioGroupItem value="platform" id="platform" data-testid="radio-build-platform" />
                              <Label htmlFor="platform" className="flex items-center cursor-pointer">
                                <Layers className={cn("w-5 h-5", dir === 'rtl' ? "ml-2" : "mr-2")} />
                                {lang === 'ar' ? 'منصة/بوابة' : 'Platform/Portal'}
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Step 2: Features */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">
                    {lang === 'ar' ? 'الميزات المطلوبة' : 'Required Features'}
                  </h3>

                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'اختر الميزات التي تحتاجها' : 'Select the features you need'}</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getAvailableFeatures().map((feature) => (
                            <FormField
                              key={feature.id}
                              control={form.control}
                              name="features"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(feature.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, feature.id])
                                          : field.onChange(field.value?.filter((value) => value !== feature.id))
                                      }}
                                      data-testid={`checkbox-feature-${feature.id.replace(/\s+/g, '-').toLowerCase()}`}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-medium">
                                      {feature.label}
                                    </FormLabel>
                                    <p className="text-xs text-gray-500">{feature.desc}</p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* Step 3: Requirements & Attachments */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">
                    {lang === 'ar' ? 'المتطلبات والمرفقات' : 'Requirements & Attachments'}
                  </h3>

                  <FormField
                    control={form.control}
                    name="ideaSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'وصف موجز للفكرة' : 'Brief Description of Idea'} *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={lang === 'ar' ? 'اكتب وصفاً مفصلاً لفكرة مشروعك...' : 'Write a detailed description of your project idea...'}
                            className="min-h-[120px]"
                            data-testid="textarea-idea-summary"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {lang === 'ar' ? 'يرجى كتابة 20 حرف على الأقل' : 'Please write at least 20 characters'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'الجمهور المستهدف (اختياري)' : 'Target Audience (Optional)'}</FormLabel>
                        <FormControl>
                          <Input placeholder={lang === 'ar' ? 'مثال: الشركات الصغيرة، الطلاب، العائلات...' : 'Example: Small businesses, students, families...'} {...field} data-testid="input-target-audience" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'النطاق/الدومين (اختياري)' : 'Domain (Optional)'}</FormLabel>
                        <FormControl>
                          <Input placeholder={lang === 'ar' ? 'مثال: example.com' : 'Example: example.com'} {...field} data-testid="input-domain" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasHosting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {lang === 'ar' ? 'هل لديك استضافة حالية؟' : 'Do you have current hosting?'}
                          </FormLabel>
                          <FormDescription>
                            {lang === 'ar' ? 'إذا كان لديك استضافة ويب حالية' : 'If you have existing web hosting'}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-has-hosting"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {lang === 'ar' ? 'رفع ملفات المرفقات' : 'Upload Attachment Files'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === 'ar' ? 'PNG, JPG, PDF, DOC, ZIP (حد أقصى 10 ميجابايت)' : 'PNG, JPG, PDF, DOC, ZIP (Max 10MB)'}
                    </p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.txt,.zip"
                      className="mt-2"
                      data-testid="input-file-attachments"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const maxFileSize = 10 * 1024 * 1024; // 10MB
                        const maxFiles = 5;
                        const allowedTypes = [
                          'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
                          'application/pdf',
                          'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'text/plain',
                          'application/zip'
                        ];
                        
                        // Check file count limit
                        const currentAttachments = form.getValues("attachments") || [];
                        if (currentAttachments.length + files.length > maxFiles) {
                          toast({
                            title: lang === 'ar' ? "تجاوز عدد الملفات المسموح" : "Too many files",
                            description: lang === 'ar' ? `الحد الأقصى ${maxFiles} ملفات` : `Maximum ${maxFiles} files allowed`,
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // Validate files
                        const validFiles = files.filter(file => {
                          if (file.size > maxFileSize) {
                            toast({
                              title: lang === 'ar' ? "حجم الملف كبير جداً" : "File too large",
                              description: `${file.name} ${lang === 'ar' ? 'يتجاوز الحد الأقصى 10 ميجابايت' : 'exceeds 10MB limit'}`,
                              variant: "destructive"
                            });
                            return false;
                          }
                          if (!allowedTypes.includes(file.type)) {
                            toast({
                              title: lang === 'ar' ? "نوع ملف غير مدعوم" : "Unsupported file type",
                              description: `${file.name} ${lang === 'ar' ? 'نوع غير مسموح' : 'type not allowed'}`,
                              variant: "destructive"
                            });
                            return false;
                          }
                          return true;
                        });
                        
                        const newAttachments = validFiles.map(file => ({
                          fileName: file.name,
                          size: file.size,
                          mime: file.type,
                          tempUrl: URL.createObjectURL(file)
                        }));
                        
                        // Append to existing attachments
                        form.setValue("attachments", [...currentAttachments, ...newAttachments]);
                        
                        // Clear the input for potential re-upload
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    />
                  </div>

                  {form.watch("attachments").length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">{lang === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}</h4>
                      {form.watch("attachments").map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <span className="text-sm">{file.fileName} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const attachments = form.watch("attachments");
                              // Revoke object URL before removing
                              if (attachments[index].tempUrl) {
                                URL.revokeObjectURL(attachments[index].tempUrl);
                              }
                              const newAttachments = attachments.filter((_, i) => i !== index);
                              form.setValue("attachments", newAttachments);
                            }}
                            data-testid={`button-remove-attachment-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">
                    {lang === 'ar' ? 'مراجعة وإرسال الطلب' : 'Review & Submit Request'}
                  </h3>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lang === 'ar' ? 'فئة المشروع:' : 'Project Category:'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {form.watch("category") === 'commercial' ? (lang === 'ar' ? 'تجاري' : 'Commercial') :
                         form.watch("category") === 'educational' ? (lang === 'ar' ? 'تعليمي' : 'Educational') :
                         (lang === 'ar' ? 'أخرى' : 'Other')}
                        {form.watch("categoryOtherNote") && ` - ${form.watch("categoryOtherNote")}`}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lang === 'ar' ? 'نوع التنفيذ:' : 'Build Type:'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {form.watch("buildKind") === 'website' ? (lang === 'ar' ? 'موقع ويب' : 'Website') :
                         form.watch("buildKind") === 'ecommerce' ? (lang === 'ar' ? 'متجر إلكتروني' : 'E-commerce') :
                         (lang === 'ar' ? 'منصة/بوابة' : 'Platform/Portal')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lang === 'ar' ? 'الميزات المختارة:' : 'Selected Features:'}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("features").map((featureId) => {
                          const feature = getAvailableFeatures().find(f => f.id === featureId);
                          return (
                            <Badge key={featureId} variant="secondary">
                              {feature?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lang === 'ar' ? 'وصف الفكرة:' : 'Idea Description:'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {form.watch("ideaSummary")}
                      </p>
                    </div>

                    {form.watch("attachments").length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {lang === 'ar' ? 'المرفقات:' : 'Attachments:'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {form.watch("attachments").length} {lang === 'ar' ? 'ملف مرفق' : 'files attached'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  data-testid="button-wizard-prev"
                >
                  <ArrowLeft className={cn("w-4 h-4", dir === 'rtl' ? "rotate-180 ml-2" : "mr-2")} />
                  {lang === 'ar' ? 'السابق' : 'Previous'}
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateCurrentStep()}
                    data-testid="button-wizard-next"
                  >
                    {lang === 'ar' ? 'التالي' : 'Next'}
                    <ArrowRight className={cn("w-4 h-4", dir === 'rtl' ? "rotate-180 mr-2" : "ml-2")} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending || !validateCurrentStep()}
                    data-testid="button-wizard-submit"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" data-testid="loading-spinner" />
                        {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <Check className={cn("w-4 h-4", dir === 'rtl' ? "ml-2" : "mr-2")} />
                        {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
