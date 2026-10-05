import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ArticleModal } from './components/ArticleModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { Project, Article, ThemeScheme } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [themeScheme, setThemeScheme] = useState<ThemeScheme>(() => {
    return (localStorage.getItem('creative_theme_scheme') as ThemeScheme) || 'azure';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('creative_theme_dark') === 'true';
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Sync color scheme and dark mode to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeScheme);
    localStorage.setItem('creative_theme_scheme', themeScheme);
  }, [themeScheme]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('creative_theme_dark', isDark ? 'true' : 'false');
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-base text-contrast transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        themeScheme={themeScheme}
        setThemeScheme={setThemeScheme}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <HomePage
            onSelectProject={setSelectedProject}
            onSelectArticle={setSelectedArticle}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {currentTab === 'about' && (
          <AboutPage onNavigateTab={handleNavigateTab} />
        )}
        {currentTab === 'work' && (
          <WorkPage
            onSelectProject={setSelectedProject}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {currentTab === 'services' && (
          <ServicesPage onNavigateTab={handleNavigateTab} />
        )}
        {currentTab === 'blog' && (
          <BlogPage onSelectArticle={setSelectedArticle} />
        )}
        {currentTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={handleNavigateTab} />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectContact={() => {
          setSelectedProject(null);
          handleNavigateTab('contact');
        }}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};

export default App;
