import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/lang";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  FileText,
  Users,
  Zap,
  Shield,
  Rocket,
  Monitor,
  Heart,
  Code,
  ShoppingCart,
  Building,
  Layers,
  Database,
  Search,
  Smartphone,
  Tablet,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MessageSquare,
  X,
  Send
} from "lucide-react";
import { SiReact, SiNextdotjs, SiTypescript } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Import our web-specific components
import { ServiceHero } from "@/components/services/web/ServiceHero";
import { FeatureGrid } from "@/components/services/web/FeatureGrid";
import { TechStack } from "@/components/services/web/TechStack";
import { ProcessTimeline } from "@/components/services/web/ProcessTimeline";
import { Deliverables } from "@/components/services/web/Deliverables";
import { GettingStarted } from "@/components/services/web/GettingStarted";
import { StickyCTA } from "@/components/services/web/StickyCTA";

interface PlanStep {
  id: number;
  isCompleted: boolean;
  isActive: boolean;
}

interface WebProjectType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
  bgColor: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  isRequired?: boolean;
}

interface PlanningState {
  currentStep: number;
  selectedProjectType: string | null;
  selectedFeatures: string[];
  selectedSpecializations: string[];
  uploadedFiles: File[];
  projectDetails: {
    projectName: string;
    projectDescription: string;
    targetAudience: string;
    budget: string;
    timeline: string;
    additionalRequirements: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
}

export default function WebDetail() {
  const { lang, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Web service data
  const [isLoading, setIsLoading] = useState(false);
  
  const getWebData = () => {
    return {
      hero: {
        title: lang === 'ar' ? 'تطوير المواقع والمنصات الرقمية' : 'Web & Platform Development',
        subtitle: lang === 'ar' ? 'مواقع ومنصات احترافية متطورة' : 'Professional Advanced Websites & Platforms',
        description: lang === 'ar' ? 'نصمم ونطور مواقع ومنصات حديثة ومتجاوبة مع أفضل ممارسات SEO والأداء' : 'We design and develop modern responsive websites and platforms with best SEO and performance practices',
        primaryCta: lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now',
        secondaryCta: lang === 'ar' ? 'تحدث مع خبير' : 'Talk to an Expert'
      },
      features: {
        title: lang === 'ar' ? 'نقاط القوة' : 'Our Strengths',
        items: [
          {
            icon: 'Shield',
            title: lang === 'ar' ? 'أمان وحماية متقدمة' : 'Advanced Security & Protection',
            desc: lang === 'ar' ? 'حماية شاملة مع أحدث معايير الأمان' : 'Comprehensive protection with latest security standards'
          },
          {
            icon: 'Languages',
            title: lang === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support',
            desc: lang === 'ar' ? 'دعم كامل للعربية والإنجليزية مع RTL' : 'Full Arabic and English support with RTL'
          },
          {
            icon: 'Rocket',
            title: lang === 'ar' ? 'أداء فائق السرعة' : 'Lightning Fast Performance',
            desc: lang === 'ar' ? 'مواقع سريعة ومحسنة للأداء العالي' : 'Fast websites optimized for high performance'
          },
          {
            icon: 'Globe',
            title: lang === 'ar' ? 'تصميم متجاوب' : 'Responsive Design',
            desc: lang === 'ar' ? 'تجربة مثالية على جميع الأجهزة' : 'Perfect experience across all devices'
          },
          {
            icon: 'Search',
            title: lang === 'ar' ? 'محسن لمحركات البحث' : 'SEO Optimized',
            desc: lang === 'ar' ? 'ظهور أفضل في نتائج البحث' : 'Better visibility in search results'
          },
          {
            icon: 'Monitor',
            title: lang === 'ar' ? 'لوحة تحكم متقدمة' : 'Advanced Dashboard',
            desc: lang === 'ar' ? 'إدارة سهلة ومرنة للمحتوى' : 'Easy and flexible content management'
          }
        ]
      },
      techStack: {
        title: lang === 'ar' ? 'التقنيات المستخدمة' : 'Technology Stack',
        items: lang === 'ar' ? [
          'React.js - مكتبة واجهات تفاعلية',
          'Next.js - إطار عمل للمواقع السريعة',
          'TypeScript - لغة برمجة محسنة',
          'Tailwind CSS - تصميم عصري ومرن',
          'PostgreSQL - قاعدة بيانات قوية',
          'Node.js - خادم تطبيقات متطور'
        ] : [
          'React.js - Interactive UI library',
          'Next.js - Fast websites framework',
          'TypeScript - Enhanced programming language',
          'Tailwind CSS - Modern flexible design',
          'PostgreSQL - Powerful database',
          'Node.js - Advanced application server'
        ]
      },
      process: {
        title: lang === 'ar' ? 'مراحل العمل' : 'Work Process',
        steps: lang === 'ar' ? [
          { phase: 'تحليل المتطلبات', note: 'دراسة شاملة للمشروع والأهداف' },
          { phase: 'التصميم وتجربة المستخدم', note: 'تصميم واجهات احترافية وتجربة مميزة' },
          { phase: 'التطوير والبرمجة', note: 'بناء الموقع باستخدام أحدث التقنيات' },
          { phase: 'الاختبار والمراجعة', note: 'اختبار شامل وضمان جودة الأداء' },
          { phase: 'النشر والإطلاق', note: 'إطلاق الموقع ومتابعة الأداء' }
        ] : [
          { phase: 'Requirements Analysis', note: 'Comprehensive project and goals study' },
          { phase: 'Design & UX', note: 'Professional interfaces and premium experience design' },
          { phase: 'Development & Programming', note: 'Building website using latest technologies' },
          { phase: 'Testing & Review', note: 'Comprehensive testing and performance quality assurance' },
          { phase: 'Launch & Deployment', note: 'Website launch and performance monitoring' }
        ]
      },
      deliverables: {
        title: lang === 'ar' ? 'المخرجات والتسليمات' : 'Deliverables',
        items: lang === 'ar' ? [
          'موقع ويب كامل ومتجاوب',
          'لوحة تحكم للإدارة',
          'شهادة SSL للأمان',
          'تحسين محركات البحث',
          'دليل الاستخدام',
          'دعم فني لمدة 3 أشهر',
          'تدريب على الاستخدام',
          'ملفات المصدر والتصميم'
        ] : [
          'Complete responsive website',
          'Admin control panel',
          'SSL security certificate',
          'Search engine optimization',
          'User manual',
          '3 months technical support',
          'Usage training',
          'Source files and designs'
        ]
      },
      requirements: {
        title: lang === 'ar' ? 'ما نحتاجه للبدء' : 'What We Need to Start',
        items: lang === 'ar' ? [
          'الهوية البصرية والشعار',
          'المحتوى والنصوص',
          'الصور عالية الجودة',
          'متطلبات الوظائف المطلوبة',
          'أمثلة لمواقع مفضلة'
        ] : [
          'Visual identity and logo',
          'Content and texts',
          'High-quality images',
          'Required functionality requirements',
          'Examples of preferred websites'
        ]
      },
      cta: {
        title: lang === 'ar' ? 'جاهز للانطلاق؟' : 'Ready to Launch?',
        desc: lang === 'ar' ? 'لنحول فكرتك إلى موقع رقمي حقيقي' : 'Let\'s turn your idea into a real digital website',
        primary: lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project',
        secondary: lang === 'ar' ? 'تحدث مع خبير' : 'Talk to Expert'
      },
      seo: {
        title: lang === 'ar' ? 'تطوير المواقع والمنصات | GSC' : 'Web & Platform Development | GSC',
        description: lang === 'ar' ? 'تطوير مواقع ومنصات احترافية متجاوبة' : 'Professional responsive websites and platforms development'
      }
    };
  };

  const [planningState, setPlanningState] = useState<PlanningState>({
    currentStep: 1,
    selectedProjectType: null,
    selectedFeatures: [],
    selectedSpecializations: [],
    uploadedFiles: [],
    projectDetails: {
      projectName: '',
      projectDescription: '',
      targetAudience: '',
      budget: '',
      timeline: '',
      additionalRequirements: ''
    },
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project Types Definition
  const getProjectTypes = (): WebProjectType[] => [
    {
      id: 'corporate',
      name: lang === 'ar' ? 'موقع شركة' : 'Corporate Website',
      description: lang === 'ar' ? 'مواقع احترافية للشركات والأعمال' : 'Professional websites for companies and businesses',
      icon: Building,
      features: lang === 'ar' ? [
        'صفحات الشركة الأساسية',
        'معرض الأعمال والخدمات',
        'نماذج التواصل',
        'دعم متعدد اللغات'
      ] : [
        'Essential company pages',
        'Portfolio and services gallery',
        'Contact forms',
        'Multi-language support'
      ],
      color: 'blue',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'ecommerce',
      name: lang === 'ar' ? 'متجر إلكتروني' : 'E-commerce Store',
      description: lang === 'ar' ? 'متاجر إلكترونية متطورة للتجارة الرقمية' : 'Advanced e-commerce stores for digital trade',
      icon: ShoppingCart,
      features: lang === 'ar' ? [
        'كتالوج منتجات شامل',
        'سلة شراء ونظام دفع',
        'إدارة المخزون',
        'تقارير المبيعات'
      ] : [
        'Comprehensive product catalog',
        'Shopping cart & payment system',
        'Inventory management',
        'Sales reports'
      ],
      color: 'green',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'platform',
      name: lang === 'ar' ? 'منصة رقمية' : 'Digital Platform',
      description: lang === 'ar' ? 'منصات إدارة المحتوى والأعمال' : 'Content and business management platforms',
      icon: Layers,
      features: lang === 'ar' ? [
        'إدارة المستخدمين',
        'لوحات تحكم متقدمة',
        'تقارير وتحليلات',
        'واجهات برمجة التطبيقات'
      ] : [
        'User management',
        'Advanced dashboards',
        'Reports and analytics',
        'API interfaces'
      ],
      color: 'purple',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'portal',
      name: lang === 'ar' ? 'بوابة إلكترونية' : 'Web Portal',
      description: lang === 'ar' ? 'بوابات متخصصة للخدمات والمعلومات' : 'Specialized portals for services and information',
      icon: Globe,
      features: lang === 'ar' ? [
        'نظام عضويات',
        'محتوى تفاعلي',
        'منتديات ومجتمعات',
        'أدوات تعاون'
      ] : [
        'Membership system',
        'Interactive content',
        'Forums and communities',
        'Collaboration tools'
      ],
      color: 'indigo',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'webapp',
      name: lang === 'ar' ? 'تطبيق ويب' : 'Web Application',
      description: lang === 'ar' ? 'تطبيقات ويب تفاعلية ومتطورة' : 'Interactive and advanced web applications',
      icon: Code,
      features: lang === 'ar' ? [
        'واجهات تفاعلية',
        'معالجة البيانات',
        'تكامل مع الأنظمة',
        'أمان متقدم'
      ] : [
        'Interactive interfaces',
        'Data processing',
        'System integration',
        'Advanced security'
      ],
      color: 'orange',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      id: 'landing',
      name: lang === 'ar' ? 'صفحة هبوط' : 'Landing Page',
      description: lang === 'ar' ? 'صفحات هبوط محسنة للتحويل' : 'Conversion-optimized landing pages',
      icon: Rocket,
      features: lang === 'ar' ? [
        'تصميم جذاب ومؤثر',
        'محسن للتحويل',
        'نماذج ذكية',
        'تتبع التحليلات'
      ] : [
        'Attractive and impactful design',
        'Conversion optimized',
        'Smart forms',
        'Analytics tracking'
      ],
      color: 'pink',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    }
  ];

  // Features Definition
  const getFeatures = (): Feature[] => [
    // Core Features
    {
      id: 'responsive_design',
      name: lang === 'ar' ? 'تصميم متجاوب' : 'Responsive Design',
      description: lang === 'ar' ? 'تجربة مثالية على جميع الأجهزة' : 'Perfect experience on all devices',
      category: 'core',
      isRequired: true
    },
    {
      id: 'seo_optimization',
      name: lang === 'ar' ? 'تحسين محركات البحث' : 'SEO Optimization',
      description: lang === 'ar' ? 'ظهور أفضل في نتائج البحث' : 'Better visibility in search results',
      category: 'core'
    },
    {
      id: 'performance_optimization',
      name: lang === 'ar' ? 'تحسين الأداء' : 'Performance Optimization',
      description: lang === 'ar' ? 'سرعة تحميل فائقة' : 'Lightning fast loading speed',
      category: 'core'
    },
    {
      id: 'ssl_security',
      name: lang === 'ar' ? 'شهادة SSL' : 'SSL Certificate',
      description: lang === 'ar' ? 'حماية وتشفير البيانات' : 'Data protection and encryption',
      category: 'core'
    },

    // Business Features
    {
      id: 'cms_system',
      name: lang === 'ar' ? 'نظام إدارة المحتوى' : 'Content Management System',
      description: lang === 'ar' ? 'إدارة سهلة للمحتوى' : 'Easy content management',
      category: 'business'
    },
    {
      id: 'user_accounts',
      name: lang === 'ar' ? 'حسابات المستخدمين' : 'User Accounts',
      description: lang === 'ar' ? 'تسجيل دخول وإدارة المستخدمين' : 'Login and user management',
      category: 'business'
    },
    {
      id: 'admin_dashboard',
      name: lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard',
      description: lang === 'ar' ? 'لوحة شاملة لإدارة الموقع' : 'Comprehensive website management panel',
      category: 'business'
    },
    {
      id: 'analytics_integration',
      name: lang === 'ar' ? 'تكامل التحليلات' : 'Analytics Integration',
      description: lang === 'ar' ? 'تتبع الزوار والإحصائيات' : 'Visitor tracking and statistics',
      category: 'business'
    },

    // E-commerce Features
    {
      id: 'shopping_cart',
      name: lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart',
      description: lang === 'ar' ? 'نظام شراء متطور' : 'Advanced shopping system',
      category: 'ecommerce'
    },
    {
      id: 'payment_gateway',
      name: lang === 'ar' ? 'بوابة الدفع' : 'Payment Gateway',
      description: lang === 'ar' ? 'دفع آمن ومتعدد الطرق' : 'Secure multi-method payment',
      category: 'ecommerce'
    },
    {
      id: 'inventory_management',
      name: lang === 'ar' ? 'إدارة المخزون' : 'Inventory Management',
      description: lang === 'ar' ? 'تتبع وإدارة المنتجات' : 'Product tracking and management',
      category: 'ecommerce'
    },

    // Technical Features
    {
      id: 'api_integration',
      name: lang === 'ar' ? 'تكامل واجهات البرمجة' : 'API Integration',
      description: lang === 'ar' ? 'ربط مع الأنظمة الخارجية' : 'Connect with external systems',
      category: 'technical'
    },
    {
      id: 'database_optimization',
      name: lang === 'ar' ? 'تحسين قاعدة البيانات' : 'Database Optimization',
      description: lang === 'ar' ? 'أداء فائق لقاعدة البيانات' : 'Superior database performance',
      category: 'technical'
    },
    {
      id: 'backup_system',
      name: lang === 'ar' ? 'نظام النسخ الاحتياطي' : 'Backup System',
      description: lang === 'ar' ? 'حماية البيانات والملفات' : 'Data and file protection',
      category: 'technical'
    }
  ];

  // Steps for planning process
  const planSteps = [
    {
      id: 1,
      title: lang === 'ar' ? 'نوع المشروع' : 'Project Type',
      description: lang === 'ar' ? 'اختر نوع الموقع أو المنصة' : 'Choose website or platform type'
    },
    {
      id: 2,
      title: lang === 'ar' ? 'الميزات' : 'Features',
      description: lang === 'ar' ? 'حدد الميزات المطلوبة' : 'Select required features'
    },
    {
      id: 3,
      title: lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details',
      description: lang === 'ar' ? 'أضف تفاصيل مشروعك' : 'Add your project details'
    },
    {
      id: 4,
      title: lang === 'ar' ? 'الملفات والمستندات' : 'Files & Documents',
      description: lang === 'ar' ? 'ارفع الملفات ذات الصلة' : 'Upload relevant files'
    },
    {
      id: 5,
      title: lang === 'ar' ? 'معلومات التواصل' : 'Contact Info',
      description: lang === 'ar' ? 'أدخل معلومات التواصل' : 'Enter contact information'
    }
  ];

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      // Add customer information
      formData.append('customerName', planningState.contactInfo.name);
      formData.append('customerEmail', planningState.contactInfo.email);
      formData.append('customerPhone', planningState.contactInfo.phone);
      if (planningState.contactInfo.company) {
        formData.append('customerCompany', planningState.contactInfo.company);
      }
      
      // Add project details
      formData.append('projectType', planningState.selectedProjectType || '');
      if (planningState.projectDetails.projectName) {
        formData.append('projectName', planningState.projectDetails.projectName);
      }
      if (planningState.projectDetails.projectDescription) {
        formData.append('projectDescription', planningState.projectDetails.projectDescription);
      }
      
      // Add selected features as JSON string
      formData.append('selectedFeatures', JSON.stringify(planningState.selectedFeatures));
      
      // Add additional requirements
      let additionalRequirements = planningState.projectDetails.additionalRequirements || '';
      
      if (planningState.projectDetails.targetAudience) {
        additionalRequirements += `\n\nالجمهور المستهدف: ${planningState.projectDetails.targetAudience}`;
      }
      
      formData.append('additionalRequirements', additionalRequirements);
      
      // Add budget and timeline
      if (planningState.projectDetails.budget) {
        formData.append('estimatedBudget', planningState.projectDetails.budget);
      }
      if (planningState.projectDetails.timeline) {
        formData.append('preferredTimeline', planningState.projectDetails.timeline);
      }
      
      // Add files
      planningState.uploadedFiles.forEach((file) => {
        formData.append('attachedFiles', file);
      });

      const response = await fetch('/api/web-project-orders', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request submitted successfully',
        description: lang === 'ar' ? 'سنتواصل معك قريباً لمناقشة تفاصيل المشروع' : 'We will contact you soon to discuss project details',
      });
      
      // Reset planning state
      setPlanningState({
        currentStep: 1,
        selectedProjectType: null,
        selectedFeatures: [],
        selectedSpecializations: [],
        uploadedFiles: [],
        projectDetails: {
          projectName: '',
          projectDescription: '',
          targetAudience: '',
          budget: '',
          timeline: '',
          additionalRequirements: ''
        },
        contactInfo: {
          name: '',
          email: '',
          phone: '',
          company: ''
        }
      });
    },
    onError: () => {
      toast({
        title: lang === 'ar' ? 'حدث خطأ' : 'Error occurred',
        description: lang === 'ar' ? 'فشل في إرسال الطلب، يرجى المحاولة مرة أخرى' : 'Failed to submit request, please try again',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    submitMutation.mutate();
    setIsSubmitting(false);
  };

  const webData = getWebData();

  return (
    <>
      <SEOHead 
        title={webData.seo.title}
        description={webData.seo.description}
      />
      
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section with Platform Bar */}
        <ServiceHero
          title={webData.hero.title}
          subtitle={webData.hero.subtitle}
          description={webData.hero.description}
          primaryCta={webData.hero.primaryCta}
          secondaryCta={webData.hero.secondaryCta}
        />

        {/* Interactive Planning System */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {lang === 'ar' ? 'خطط مشروعك معنا' : 'Plan Your Project With Us'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {lang === 'ar' ? 'نساعدك في تحديد متطلبات مشروعك خطوة بخطوة للحصول على أفضل النتائج' : 'We help you define your project requirements step by step for the best results'}
              </p>
            </motion.div>

            {/* Planning Steps Implementation would go here */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                <CardContent className="p-8 text-center">
                  <Globe className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {lang === 'ar' ? 'نظام التخطيط التفاعلي قريباً' : 'Interactive Planning System Coming Soon'}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {lang === 'ar' ? 'سيتم إضافة نظام تخطيط تفاعلي متطور قريباً لمساعدتك في تحديد متطلبات مشروعك بدقة' : 'An advanced interactive planning system will be added soon to help you accurately define your project requirements'}
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => setLocation('/contact?service=web-development')}
                    className="bg-primary hover:bg-primary-dark text-white"
                  >
                    <ArrowRight className={cn(
                      "w-5 h-5 mr-2",
                      dir === 'rtl' && "rotate-180 mr-0 ml-2"
                    )} />
                    {lang === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <FeatureGrid
          title={webData.features.title}
          features={webData.features.items}
        />

        {/* Technology Stack */}
        <TechStack
          title={webData.techStack.title}
          stack={webData.techStack.items}
        />

        {/* Process Timeline */}
        <ProcessTimeline
          title={webData.process.title}
          steps={webData.process.steps}
        />

        {/* Deliverables */}
        <Deliverables
          title={webData.deliverables.title}
          items={webData.deliverables.items}
        />

        {/* Getting Started */}
        <GettingStarted
          title={webData.requirements.title}
          items={webData.requirements.items}
        />

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary to-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {webData.cta.title}
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                {webData.cta.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => setLocation('/contact?service=web-development')}
                >
                  <ArrowRight className={cn(
                    "w-5 h-5 mr-2",
                    dir === 'rtl' && "rotate-180 mr-0 ml-2"
                  )} />
                  {webData.cta.primary}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => setLocation('/contact?service=web-development&type=consultation')}
                >
                  {webData.cta.secondary}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sticky CTA for mobile */}
        <StickyCTA
          title={webData.cta.title}
          description={webData.cta.desc}
          primaryLabel={webData.cta.primary}
          secondaryLabel={webData.cta.secondary}
        />
      </main>
    </>
  );
}