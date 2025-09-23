import React from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Users, Target, Lightbulb, Award, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/base/buttons/button';
import { Link } from 'react-router';

const AboutPage: React.FC = () => {
  const t = useTranslations('About');
  const commonT = useTranslations('Common');

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('values.compassion.title'),
      description: t('values.compassion.description'),
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('values.collaboration.title'),
      description: t('values.collaboration.description'),
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('values.impact.title'),
      description: t('values.impact.description'),
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    }
  ];

  const achievements = [
    { number: '10,000+', label: t('achievements.volunteers') },
    { number: '500+', label: t('achievements.organizations') },
    { number: '1,000+', label: t('achievements.events') },
    { number: '50+', label: t('achievements.cities') }
  ];

  const features = [
    t('features.networking'),
    t('features.skillDevelopment'),
    t('features.communityImpact'),
    t('features.culturalExchange'),
    t('features.careerGrowth'),
    t('features.socialChange')
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-white opacity-5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-3 rounded-full"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  {t('hero.joinEvents')}
                </Button>
              </Link>
              <Link to="/organizations">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold">
                  {t('hero.findOrganizations')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('mission.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('mission.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('mission.ourMission')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('mission.missionText')}
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('mission.ourVision')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('mission.visionText')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('values.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('values.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('achievements.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('achievements.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-lg text-gray-700 font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('features.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('howItWorks.step1.title')}
                </h3>
                <p className="text-gray-600">
                  {t('howItWorks.step1.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('howItWorks.step2.title')}
                </h3>
                <p className="text-gray-600">
                  {t('howItWorks.step2.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('howItWorks.step3.title')}
                </h3>
                <p className="text-gray-600">
                  {t('howItWorks.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('team.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('team.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AS</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('team.founder.name')}
                </h3>
                <p className="text-orange-600 font-medium mb-3">
                  {t('team.founder.role')}
                </p>
                <p className="text-gray-600 text-sm">
                  {t('team.founder.description')}
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">CM</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('team.communityManager.name')}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {t('team.communityManager.role')}
                </p>
                <p className="text-gray-600 text-sm">
                  {t('team.communityManager.description')}
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">TD</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('team.techLead.name')}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {t('team.techLead.role')}
                </p>
                <p className="text-gray-600 text-sm">
                  {t('team.techLead.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  {t('cta.browseEvents')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/organizations">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold">
                  {t('cta.joinOrganization')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
