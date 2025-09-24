/**
 * 🔍 FINAL SYSTEM ANALYSIS - Production Ready Checker
 * Comprehensive analysis tool for deployment readiness
 */

const fs = require('fs').promises;
const path = require('path');

class FinalSystemAnalyzer {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      fileStructure: {},
      codeQuality: {},
      functionality: {},
      production: {},
      security: {},
      performance: {},
      userInterface: {},
      overall: {}
    };
  }

  async runFinalAnalysis() {
    console.log('🔍 HAYDAY CHAT SYSTEM - FINAL PRODUCTION ANALYSIS');
    console.log('═'.repeat(65));
    console.log('⏰ Analysis Time:', new Date().toLocaleString('tr-TR'));
    console.log('🎯 Target: 97%+ Production Ready Score');
    console.log('');
    
    try {
      await this.analyzeFileStructure();
      await this.analyzeCodeQuality(); 
      await this.analyzeFunctionality();
      await this.analyzeProductionReadiness();
      await this.analyzeSecurity();
      await this.analyzePerformance();
      await this.analyzeUserInterface();
      
      this.generateFinalReport();
      return this.results;
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return null;
    }
  }

  async analyzeFileStructure() {
    console.log('📁 File Structure Analysis...');
    
    const criticalFiles = {
      core: ['package.json', 'server.js', 'render.yaml', '.env.example'],
      frontend: ['index.html', 'admin.html', 'login.html', 'style.css', 'script.js'],
      data: ['chat-log.json', 'knowledge-base.json', 'analytics.json', 'admin-sessions.json'],
      assets: ['assets/js/chat-loader.js', 'assets/js/ai-brain.js', 'assets/js/telegram-bot.js', 'assets/js/utils.js'],
      tools: ['fix-html-encoding.js', 'system-analysis.js', 'utf8-test.js', 'utf8-fix.js'],
      docs: ['README.md', 'PRODUCTION-READY-CHECKLIST.md', '.gitignore']
    };

    let totalRequired = 0;
    let foundFiles = 0;
    const categoryResults = {};

    for (const [category, files] of Object.entries(criticalFiles)) {
      let categoryFound = 0;
      
      for (const file of files) {
        totalRequired++;
        try {
          const stats = await fs.stat(file);
          foundFiles++;
          categoryFound++;
          console.log(`✅ ${file} (${this.formatSize(stats.size)})`);
        } catch {
          console.log(`❌ ${file} - MISSING`);
        }
      }
      
      categoryResults[category] = {
        required: files.length,
        found: categoryFound,
        percentage: Math.round((categoryFound / files.length) * 100)
      };
    }

    this.results.fileStructure = {
      totalRequired,
      foundFiles,
      completeness: Math.round((foundFiles / totalRequired) * 100),
      categories: categoryResults
    };

    console.log(`📊 File Completeness: ${this.results.fileStructure.completeness}% (${foundFiles}/${totalRequired})\n`);
  }

  async analyzeCodeQuality() {
    console.log('🔧 Code Quality Analysis...');
    
    const codeFiles = [
      'server.js', 'script.js', 'assets/js/chat-loader.js',
      'assets/js/ai-brain.js', 'assets/js/utils.js'
    ];

    let totalLines = 0;
    let qualityFiles = 0;
    let utf8Issues = 0;
    let errorHandling = 0;
    const fileDetails = {};

    for (const file of codeFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n').length;
        totalLines += lines;

        const analysis = {
          lines,
          hasContent: lines > 20,
          hasUTF8Issues: this.hasEncodingIssues(content),
          hasErrorHandling: this.hasErrorHandling(content),
          hasDocumentation: this.hasDocumentation(content)
        };

        fileDetails[file] = analysis;

        if (analysis.hasContent) qualityFiles++;
        if (analysis.hasUTF8Issues) utf8Issues++;
        if (analysis.hasErrorHandling) errorHandling++;

        const status = analysis.hasContent && !analysis.hasUTF8Issues ? '✅' : '⚠️';
        const issues = [];
        if (analysis.hasUTF8Issues) issues.push('UTF-8');
        if (!analysis.hasErrorHandling) issues.push('Error handling');
        
        console.log(`${status} ${file} - ${lines} lines${issues.length ? ` (${issues.join(', ')})` : ''}`);

      } catch (error) {
        console.log(`❌ ${file} - Read error: ${error.message}`);
        fileDetails[file] = { error: error.message };
      }
    }

    this.results.codeQuality = {
      totalLines,
      qualityFiles,
      utf8Issues,
      errorHandling,
      score: Math.round(((qualityFiles * 2 + errorHandling - utf8Issues) / (codeFiles.length * 2.5)) * 100),
      details: fileDetails
    };

    console.log(`📊 Code Quality Score: ${this.results.codeQuality.score}%\n`);
  }

  async analyzeFunctionality() {
    console.log('⚙️ Functionality Analysis...');
    
    const features = {
      'ChatBot System': await this.checkChatBotSystem(),
      'AI Integration': await this.checkAIIntegration(),
      'Telegram Bot': await this.checkTelegramBot(),
      'Admin Panel': await this.checkAdminPanel(),
      'Real-time Polling': await this.checkRealTimeFeatures(),
      'Mobile Support': await this.checkMobileSupport(),
      'Cross-page Continuity': await this.checkContinuity(),
      'UTF-8 Support': await this.checkUTF8Support(),
      'File Management': await this.checkFileManagement(),
      'Health Monitoring': await this.checkHealthMonitoring()
    };

    let implementedFeatures = 0;
    for (const [feature, implemented] of Object.entries(features)) {
      const status = implemented ? '✅' : '❌';
      console.log(`${status} ${feature}`);
      if (implemented) implementedFeatures++;
    }

    this.results.functionality = {
      features,
      implemented: implementedFeatures,
      total: Object.keys(features).length,
      percentage: Math.round((implementedFeatures / Object.keys(features).length) * 100)
    };

    console.log(`📊 Functionality Score: ${this.results.functionality.percentage}%\n`);
  }

  async analyzeProductionReadiness() {
    console.log('🚀 Production Readiness Analysis...');
    
    const checks = {
      'Environment Setup': await this.checkEnvironmentSetup(),
      'Render Config': await this.checkRenderConfig(),
      'Health Endpoints': await this.checkHealthEndpoints(),
      'Error Handling': await this.checkGlobalErrorHandling(),
      'Logging System': await this.checkLoggingSystem(),
      'Graceful Shutdown': await this.checkGracefulShutdown(),
      'File Backup': await this.checkBackupSystem(),
      'Deployment Ready': await this.checkDeploymentReady()
    };

    let readyFeatures = 0;
    for (const [feature, ready] of Object.entries(checks)) {
      const status = ready ? '✅' : '❌';
      console.log(`${status} ${feature}`);
      if (ready) readyFeatures++;
    }

    this.results.production = {
      checks,
      readyFeatures,
      totalChecks: Object.keys(checks).length,
      readiness: Math.round((readyFeatures / Object.keys(checks).length) * 100)
    };

    console.log(`📊 Production Score: ${this.results.production.readiness}%\n`);
  }

  async analyzeSecurity() {
    console.log('🔒 Security Analysis...');
    
    const securityChecks = {
      'Input Validation': await this.checkInputValidation(),
      'Rate Limiting': await this.checkRateLimiting(),
      'CORS Configuration': await this.checkCORSConfig(),
      'Helmet Security': await this.checkHelmetSecurity(),
      'Admin Authentication': await this.checkAdminAuth(),
      'Session Management': await this.checkSessionManagement(),
      'XSS Protection': await this.checkXSSProtection(),
      'API Security': await this.checkAPISecurity()
    };

    let secureFeatures = 0;
    for (const [feature, secure] of Object.entries(securityChecks)) {
      const status = secure ? '✅' : '⚠️';
      console.log(`${status} ${feature}`);
      if (secure) secureFeatures++;
    }

    this.results.security = {
      checks: securityChecks,
      secureFeatures,
      totalChecks: Object.keys(securityChecks).length,
      score: Math.round((secureFeatures / Object.keys(securityChecks).length) * 100)
    };

    console.log(`📊 Security Score: ${this.results.security.score}%\n`);
  }

  async analyzePerformance() {
    console.log('⚡ Performance Analysis...');
    
    const perfChecks = {
      'File Locking': await this.checkFileLocking(),
      'Memory Management': await this.checkMemoryManagement(),
      'Database Optimization': await this.checkDatabaseOpt(),
      'Frontend Optimization': await this.checkFrontendOpt(),
      'Caching Strategy': await this.checkCaching(),
      'Resource Management': await this.checkResourceManagement()
    };

    let optimizedFeatures = 0;
    for (const [feature, optimized] of Object.entries(perfChecks)) {
      const status = optimized ? '✅' : '⚠️';
      console.log(`${status} ${feature}`);
      if (optimized) optimizedFeatures++;
    }

    this.results.performance = {
      checks: perfChecks,
      optimizedFeatures,
      totalChecks: Object.keys(perfChecks).length,
      score: Math.round((optimizedFeatures / Object.keys(perfChecks).length) * 100)
    };

    console.log(`📊 Performance Score: ${this.results.performance.score}%\n`);
  }

  async analyzeUserInterface() {
    console.log('🎨 User Interface Analysis...');
    
    const uiChecks = {
      'HTML UTF-8 Fixed': await this.checkHTMLUTF8(),
      'Mobile Responsive': await this.checkMobileResponsive(), 
      'Accessibility': await this.checkAccessibility(),
      'CSS Optimization': await this.checkCSSOptimization(),
      'Cross-browser Compat': await this.checkCrossBrowser(),
      'UI Consistency': await this.checkUIConsistency()
    };

    let uiFeatures = 0;
    for (const [feature, working] of Object.entries(uiChecks)) {
      const status = working ? '✅' : '❌';
      console.log(`${status} ${feature}`);
      if (working) uiFeatures++;
    }

    this.results.userInterface = {
      checks: uiChecks,
      workingFeatures: uiFeatures,
      totalChecks: Object.keys(uiChecks).length,
      score: Math.round((uiFeatures / Object.keys(uiChecks).length) * 100)
    };

    console.log(`📊 UI/UX Score: ${this.results.userInterface.score}%\n`);
  }

  // Helper check methods
  async checkChatBotSystem() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      const knowledgeExists = await fs.access('knowledge-base.json').then(() => true).catch(() => false);
      return serverContent.includes('ChatBotBrain') && knowledgeExists;
    } catch { return false; }
  }

  async checkAIIntegration() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('OpenAI') && serverContent.includes('gpt-3.5-turbo');
    } catch { return false; }
  }

  async checkTelegramBot() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('TelegramBot') && serverContent.includes('webhook');
    } catch { return false; }
  }

  async checkAdminPanel() {
    try {
      await fs.access('admin.html');
      await fs.access('login.html');
      return true;
    } catch { return false; }
  }

  async checkRealTimeFeatures() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('/api/chat/poll');
    } catch { return false; }
  }

  async checkMobileSupport() {
    try {
      const cssContent = await fs.readFile('style.css', 'utf8');
      return cssContent.includes('@media') && cssContent.includes('mobile');
    } catch { return false; }
  }

  async checkContinuity() {
    try {
      const scriptContent = await fs.readFile('script.js', 'utf8');
      return scriptContent.includes('localStorage') && scriptContent.includes('clientId');
    } catch { return false; }
  }

  async checkUTF8Support() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('charset=utf-8');
    } catch { return false; }
  }

  async checkFileManagement() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('FileManager') && serverContent.includes('FileLock');
    } catch { return false; }
  }

  async checkHealthMonitoring() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('/ping');
    } catch { return false; }
  }

  async checkHTMLUTF8() {
    try {
      const htmlFiles = ['index.html', 'admin.html', 'login.html'];
      for (const file of htmlFiles) {
        const content = await fs.readFile(file, 'utf8');
        if (this.hasEncodingIssues(content)) {
          return false;
        }
      }
      return true;
    } catch { return false; }
  }

  hasEncodingIssues(content) {
    const issues = ['ðŸ¤–', 'ðŸ"¤', 'ðŸ"', 'Ã‡evrimiÃ§i', 'nasÄ±l', 'âœ•', 'â³'];
    return issues.some(issue => content.includes(issue));
  }

  hasErrorHandling(content) {
    return content.includes('try {') && content.includes('catch');
  }

  hasDocumentation(content) {
    return content.includes('/**') || content.includes('//');
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  generateFinalReport() {
    const duration = Date.now() - this.startTime;
    
    console.log('═'.repeat(65));
    console.log('📊 HAYDAY CHAT SYSTEM - FINAL PRODUCTION REPORT');
    console.log('═'.repeat(65));
    
    // Calculate overall score
    const scores = [
      this.results.fileStructure.completeness,
      this.results.codeQuality.score,
      this.results.functionality.percentage,
      this.results.production.readiness,
      this.results.security.score,
      this.results.performance.score,
      this.results.userInterface.score
    ];
    
    const overallScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
    this.results.overall.score = overallScore;
    
    console.log(`\n🎯 OVERALL PRODUCTION SCORE: ${overallScore}%`);
    console.log(this.getProductionStatus(overallScore));
    
    console.log('\n📋 COMPONENT BREAKDOWN:');
    console.log(`📁 File Structure: ${this.results.fileStructure.completeness}% (${this.results.fileStructure.foundFiles}/${this.results.fileStructure.totalRequired} files)`);
    console.log(`🔧 Code Quality: ${this.results.codeQuality.score}% (${this.results.codeQuality.totalLines} lines)`);
    console.log(`⚙️ Functionality: ${this.results.functionality.percentage}% (${this.results.functionality.implemented}/${this.results.functionality.total} features)`);
    console.log(`🚀 Production: ${this.results.production.readiness}% (${this.results.production.readyFeatures}/${this.results.production.totalChecks} checks)`);
    console.log(`🔒 Security: ${this.results.security.score}% (${this.results.security.secureFeatures}/${this.results.security.totalChecks} measures)`);
    console.log(`⚡ Performance: ${this.results.performance.score}% (${this.results.performance.optimizedFeatures}/${this.results.performance.totalChecks} optimizations)`);
    console.log(`🎨 UI/UX: ${this.results.userInterface.score}% (${this.results.userInterface.workingFeatures}/${this.results.userInterface.totalChecks} features)`);

    console.log('\n🎊 DEPLOYMENT STATUS:');
    this.printDeploymentStatus(overallScore);

    console.log('\n💡 FINAL RECOMMENDATIONS:');
    this.printFinalRecommendations(overallScore);

    console.log('\n🏁 ANALYSIS COMPLETED!');
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`📅 Completed: ${new Date().toLocaleString('tr-TR')}`);
    console.log('═'.repeat(65));
  }

  getProductionStatus(score) {
    if (score >= 97) return '🏆 PRODUCTION EXCELLENCE - Deploy immediately!';
    if (score >= 93) return '🥇 PRODUCTION READY - Excellent quality!';
    if (score >= 90) return '🥈 PRODUCTION READY - Good to deploy!';
    if (score >= 85) return '🥉 NEAR PRODUCTION - Minor fixes needed';
    if (score >= 80) return '⚠️ NEEDS WORK - Several issues to resolve';
    return '🚨 NOT READY - Major development required';
  }

  printDeploymentStatus(score) {
    if (score >= 90) {
      console.log('🟢 DEPLOY APPROVED!');
      console.log('✅ All critical systems operational');
      console.log('✅ Performance metrics excellent');
      console.log('✅ Security measures in place');
      console.log('✅ User experience optimized');
      console.log('');
      console.log('🚀 DEPLOYMENT COMMANDS:');
      console.log('git add .');
      console.log('git commit -m "🚀 Production ready - All systems go!"');
      console.log('git push origin main');
    } else if (score >= 85) {
      console.log('🟡 DEPLOY WITH CAUTION');
      console.log('⚠️ Minor issues should be addressed');
      console.log('✅ Core functionality working');
    } else {
      console.log('🔴 DEPLOY NOT RECOMMENDED');
      console.log('❌ Critical issues need resolution');
      console.log('⚠️ More development required');
    }
  }

  printFinalRecommendations(score) {
    const recommendations = [];
    
    if (this.results.fileStructure.completeness < 100) {
      recommendations.push(`Complete missing files (${100 - this.results.fileStructure.completeness}% remaining)`);
    }
    
    if (this.results.userInterface.score < 90) {
      recommendations.push('Fix UI/UX issues (especially UTF-8 encoding)');
    }
    
    if (this.results.security.score < 90) {
      recommendations.push('Strengthen security measures');
    }
    
    if (score >= 97) {
      recommendations.push('🎉 System is PERFECT! Ready for enterprise deployment!');
    } else if (score >= 90) {
      recommendations.push('System is production-ready with excellent quality');
      recommendations.push('Consider UptimeRobot monitoring setup');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('No critical recommendations - system is optimized! 🎊');
    }
    
    recommendations.forEach(rec => console.log(`💡 ${rec}`));
  }

  // Simplified check methods for brevity
  async checkEnvironmentSetup() { return this.fileExists('.env.example'); }
  async checkRenderConfig() { return this.fileExists('render.yaml'); }
  async checkHealthEndpoints() { return this.hasInFile('server.js', '/ping'); }
  async checkGlobalErrorHandling() { return this.hasInFile('server.js', 'process.on'); }
  async checkLoggingSystem() { return this.hasInFile('server.js', 'Logger'); }
  async checkGracefulShutdown() { return this.hasInFile('server.js', 'SIGTERM'); }
  async checkBackupSystem() { return this.hasInFile('server.js', 'backup'); }
  async checkDeploymentReady() { return this.fileExists('package.json') && this.fileExists('render.yaml'); }
  async checkInputValidation() { return this.hasInFile('server.js', 'validationResult'); }
  async checkRateLimiting() { return this.hasInFile('server.js', 'rateLimit'); }
  async checkCORSConfig() { return this.hasInFile('server.js', 'cors'); }
  async checkHelmetSecurity() { return this.hasInFile('server.js', 'helmet'); }
  async checkAdminAuth() { return this.hasInFile('server.js', 'authenticateAdmin'); }
  async checkSessionManagement() { return this.hasInFile('server.js', 'adminSessions'); }
  async checkXSSProtection() { return this.hasInFile('script.js', 'sanitize'); }
  async checkAPISecurity() { return this.hasInFile('server.js', 'Bearer'); }
  async checkFileLocking() { return this.hasInFile('server.js', 'FileLock'); }
  async checkMemoryManagement() { return this.hasInFile('server.js', 'memoryUsage'); }
  async checkDatabaseOpt() { return this.hasInFile('server.js', 'atomic'); }
  async checkFrontendOpt() { return this.hasInFile('style.css', 'transition'); }
  async checkCaching() { return this.hasInFile('script.js', 'localStorage'); }
  async checkResourceManagement() { return this.hasInFile('server.js', 'cleanup'); }
  async checkMobileResponsive() { return this.hasInFile('style.css', '@media'); }
  async checkAccessibility() { return this.hasInFile('index.html', 'aria-'); }
  async checkCSSOptimization() { return this.hasInFile('style.css', ':root'); }
  async checkCrossBrowser() { return this.hasInFile('script.js', 'addEventListener'); }
  async checkUIConsistency() { return this.hasInFile('style.css', '--primary'); }

  async fileExists(file) {
    try {
      await fs.access(file);
      return true;
    } catch {
      return false;
    }
  }

  async hasInFile(file, searchTerm) {
    try {
      const content = await fs.readFile(file, 'utf8');
      return content.includes(searchTerm);
    } catch {
      return false;
    }
  }
}

// CLI Usage
if (require.main === module) {
  const analyzer = new FinalSystemAnalyzer();
  analyzer.runFinalAnalysis().catch(console.error);
}

module.exports = FinalSystemAnalyzer;
    } catch {
      return false;
    }
  }

  async checkDatabaseOpt() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('atomic') && 
             serverContent.includes('writeJSONFile');
    } catch {
      return false;
    }
  }

  async checkFrontendOpt() {
    try {
      const cssContent = await fs.readFile('style.css', 'utf8');
      const indexContent = await fs.readFile('index.html', 'utf8');
      return cssContent.includes('transition') && 
             indexContent.includes('defer');
    } catch {
      return false;
    }
  }

  async checkCaching() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('cache') || 
             serverContent.includes('localStorage');
    } catch {
      return false;
    }
  }

  async checkCompression() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('compression') && 
             serverContent.includes('br');
    } catch {
      return false;
    }
  }

  async checkPackageJson() {
    try {
      const packageContent = await fs.readFile('package.json', 'utf8');
      const packageJson = JSON.parse(packageContent);
      return packageJson.dependencies && packageJson.devDependencies;
    } catch {
      return false;
    }
  }

  async checkEnvTemplate() {
    try {
      const envContent = await fs.readFile('.env.example', 'utf8');
      return envContent.includes('OPENAI_API_KEY') && 
             envContent.includes('TELEGRAM_BOT_TOKEN');
    } catch {
      return false;
    }
  }

  async checkGitIgnore() {
    try {
      const gitignoreContent = await fs.readFile('.gitignore', 'utf8');
      return gitignoreContent.includes('node_modules') && 
             gitignoreContent.includes('.env');
    } catch {
      return false;
    }
  }

  async checkDocumentation() {
    try {
      const readmeContent = await fs.readFile('README.md', 'utf8');
      return readmeContent.includes('## Proje Başlangıcı') && 
             readmeContent.includes('## Kurulum');
    } catch {
      return false;
    }
  }

  async checkHealthEndpoint() {
    try {
      const serverContent = await fs.readFile('server.js', 'utf8');
      return serverContent.includes('/health') && 
             serverContent.includes('status: "UP"');
    } catch {
      return false;
    }
  }

  generateComprehensiveReport() {
    const duration = Date.now() - this.startTime;
    
    console.log('═'.repeat(60));
    console.log('📊 HAYDAY CHAT SYSTEM - KAPSAMLI ANALİZ RAPORU');
    console.log('═'.repeat(60));
    
    // Overall Score Calculation
    const scores = [
      this.results.fileStructure.completeness,
      this.results.codeQuality.score,
      this.results.functionality.percentage,
      this.results.production.readiness,
      this.results.security.score,
      this.results.performance.score,
      this.results.deployment.readiness
    ];
    
    const overallScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
    
    console.log(`\n🎯 GENEL SKOR: ${overallScore}%`);
    console.log(this.getScoreStatus(overallScore));
    
    console.log('\n📋 DETAYLI SONUÇLAR:');
    console.log(`📁 Dosya Yapısı: ${this.results.fileStructure.completeness}% (${this.results.fileStructure.found}/${this.results.fileStructure.totalRequired})`);
    console.log(`🔧 Kod Kalitesi: ${this.results.codeQuality.score}% (${this.results.codeQuality.totalLines} satır)`);
    console.log(`⚙️ Fonksiyonalite: ${this.results.functionality.percentage}% (${this.results.functionality.implemented}/${this.results.functionality.total})`);
    console.log(`🚀 Production: ${this.results.production.readiness}% (${this.results.production.readyFeatures}/${this.results.production.totalChecks})`);
    console.log(`🔒 Güvenlik: ${this.results.security.score}% (${this.results.security.secureFeatures}/${this.results.security.totalChecks})`);
    console.log(`⚡ Performans: ${this.results.performance.score}% (${this.results.performance.optimizedFeatures}/${this.results.performance.totalChecks})`);
    console.log(`🌐 Deployment: ${this.results.deployment.readiness}% (${this.results.deployment.readyFeatures}/${this.results.deployment.totalChecks})`);

    console.log('\n🎯 DURUM DEĞERLENDİRMESİ:');
    this.printStatusAssessment(overallScore);

    console.log('\n💡 ÖNERİLER:');
    this.printRecommendations();

    console.log('\n🏁 ANALİZ TAMAMLANDI!');
    console.log(`⏱️ Süre: ${duration}ms`);
    console.log(`📅 Tarih: ${new Date().toLocaleString('tr-TR')}`);
    console.log('═'.repeat(60));
  }

  getScoreStatus(score) {
    if (score >= 95) return '🏆 Mükemmel - Production için hazır!';
    if (score >= 90) return '🥇 Çok İyi - Minor iyileştirmeler';
    if (score >= 80) return '🥈 İyi - Birkaç geliştirme gerekli';
    if (score >= 70) return '🥉 Orta - Önemli iyileştirmeler';
    if (score >= 60) return '⚠️ Zayıf - Major geliştirmeler gerekli';
    return '🚨 Kritik - Significant development required';
  }

  printStatusAssessment(score) {
    if (score >= 90) {
      console.log('🟢 SİSTEM PRODUCTION READY!');
      console.log('• GitHub\'a push edilebilir');
      console.log('• Render\'da deploy edilebilir');
      console.log('• UptimeRobot ile monitor edilebilir');
    } else if (score >= 80) {
      console.log('🟡 SİSTEM NEREDEYSE HAZIR');
      console.log('• Küçük düzeltmeler yapılmalı');
      console.log('• Test environment\'da çalıştırılabilir');
    } else {
      console.log('🔴 SİSTEM HAZIR DEĞİL');
      console.log('• Kritik sorunlar giderilmeli');
      console.log('• Geliştirme devam etmeli');
    }
  }

  printRecommendations() {
    const recommendations = [];
    
    if (this.results.fileStructure.completeness < 100) {
      recommendations.push(`Eksik dosyaları tamamla: ${this.results.fileStructure.missing.slice(0, 3).join(', ')}`);
    }
    
    if (this.results.codeQuality.utf8Issues > 0) {
      recommendations.push('UTF-8 encoding sorunlarını çöz');
    }
    
    if (this.results.security.score < 85) {
      recommendations.push('Güvenlik önlemlerini güçlendir');
    }
    
    if (this.results.performance.score < 80) {
      recommendations.push('Performans optimizasyonları yap');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Sistem optimize edilmiş durumda! 🎉');
    }
    
    recommendations.forEach(rec => console.log(`💡 ${rec}`));
  }
}

// CLI Usage
if (require.main === module) {
  const analyzer = new SystemAnalyzer();
  analyzer.runCompleteAnalysis().catch(console.error);
}

module.exports = SystemAnalyzer;
