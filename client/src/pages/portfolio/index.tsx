import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { SEOHead } from "@/components/SEOHead";
import EnhancedPortfolioHero from "@/components/portfolio/enhanced-portfolio-hero";
import EnhancedPortfolioGrid from "@/components/portfolio/enhanced-portfolio-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Rocket, List, ArrowLeft, Sparkles } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";

export default function PortfolioIndex() {
  const { dir } = useLanguage();

  // Calculate statistics from portfolio data
  const totalProjects = portfolioProjects.length;
  const uniqueIndustries = new Set(portfolioProjects.map(p => p.sector)).size;
  const allTechnologies = new Set(portfolioProjects.flatMap(p => p.tech));
  
  const portfolioStats = {
    totalProjects: totalProjects || 50,
    totalIndustries: uniqueIndustries || 8,
    yearsExperience: 5,
    satisfaction: 98,
    totalClients: 150,
    totalTechnologies: allTechnologies.size || 25
  };

  return (
    <>
      <SEOHead 
        title={dir === 'rtl' ? 'معرض أعمالنا | جينيوس سوفت وير كور' : 'Our Portfolio | Genius Software Core'}
        description={dir === 'rtl' 
          ? 'استكشف مجموعة متنوعة من المشاريع التي طورناها بعناية فائقة، من التطبيقات المحمولة إلى الأنظمة المعقدة. شاهد قصص نجاحنا مع عملائنا.'
          : 'Explore our carefully crafted projects, from mobile applications to complex systems. See our success stories with clients.'
        }
        type="website"
      />
      
      <motion.div 
        className="min-h-screen bg-brand-bg"
        dir={dir}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced Hero Section with Animated Statistics */}
        <EnhancedPortfolioHero
          totalProjects={portfolioStats.totalProjects}
          totalIndustries={portfolioStats.totalIndustries}
          yearsExperience={portfolioStats.yearsExperience}
          satisfaction={portfolioStats.satisfaction}
          totalClients={portfolioStats.totalClients}
          totalTechnologies={portfolioStats.totalTechnologies}
        />

        {/* Enhanced Portfolio Grid with Advanced Filtering */}
        <section id="projects-grid" className="relative z-10">
          <EnhancedPortfolioGrid
            showFilters={true}
            showViewToggle={true}
            showLoadMore={true}
          />
        </section>

        {/* Work Process Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-sky-light/20 to-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <Sparkles className="w-5 h-5 text-brand-sky-accent" />
                <span className="text-brand-sky-accent font-semibold">عمليتنا الاحترافية</span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold text-brand-text-primary mb-6">
                كيف نحقق النجاح لمشروعك
              </h2>
              <p className="text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
                منهجية عمل مدروسة ومجربة تضمن تسليم مشروعك بأعلى معايير الجودة
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "الاستشارة والتخطيط",
                  description: "نستمع لأهدافك ونضع خطة استراتيجية شاملة",
                  icon: "💡",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100"
                },
                {
                  step: "02", 
                  title: "التصميم والنماذج",
                  description: "نصمم واجهات مستخدم جذابة وسهلة الاستخدام",
                  icon: "🎨",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100"
                },
                {
                  step: "03",
                  title: "التطوير والبرمجة",
                  description: "نطور المشروع باستخدام أحدث التقنيات العالمية",
                  icon: "⚙️",
                  color: "from-green-500 to-green-600",
                  bgColor: "from-green-50 to-green-100"
                },
                {
                  step: "04",
                  title: "التسليم والدعم",
                  description: "نسلم المشروع مع دعم فني متواصل ومتابعة دورية",
                  icon: "🚀",
                  color: "from-orange-500 to-orange-600",
                  bgColor: "from-orange-50 to-orange-100"
                },
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Card className={`border-2 border-brand-sky-base bg-gradient-to-br ${process.bgColor} hover:border-brand-sky-accent hover:shadow-xl transition-all duration-400 h-full group`}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${process.color} text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg`}>
                          {process.step}
                        </div>
                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                          {process.icon}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-brand-text-primary mb-3 group-hover:text-brand-sky-accent transition-colors">
                        {process.title}
                      </h3>
                      <p className="text-brand-text-muted leading-relaxed">
                        {process.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-sky-accent to-blue-600 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="inline-block text-6xl mb-6"
              >
                💼
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                جاهز لبدء مشروعك القادم؟
              </h2>
              
              <p className="text-xl mb-10 leading-relaxed opacity-90 max-w-2xl mx-auto">
                دعنا نحول رؤيتك إلى واقع رقمي مذهل يحقق أهدافك ويتجاوز توقعاتك
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" data-testid="link-contact-cta">
                  <Button
                    size="lg"
                    className="bg-white text-brand-sky-accent hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 text-lg font-bold group"
                    data-testid="button-start-project"
                  >
                    <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    ابدأ مشروعك الآن
                    <motion.div
                      className="mr-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </Link>

                <Link href="/services" data-testid="link-services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-brand-sky-accent transition-all duration-300 px-8 py-6 text-lg font-bold"
                    data-testid="button-view-services"
                  >
                    <List className="w-5 h-5 ml-2" />
                    تصفح خدماتنا
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
}
