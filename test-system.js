/**
 * 🧪 HayDay Chat System - Final Test Suite
 * Production readiness verification
 */

const fs = require('fs').promises;
const path = require('path');

class SystemTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🧪 HayDay Chat System - Final Test Suite');
    console.log('=' .repeat(50));
    
    await this.testFileStructure();
    await this.testEnvironmentVariables();
    await this.testPackageJson();
    await this.testDataFiles();
    await this.testStaticAssets();
    
    this.printResults();
    return this.results.failed === 0;
  }

  test(name, condition, critical = true) {
    const status = condition ? '✅ PASS' : (critical ? '❌ FAIL' : '⚠️ WARN');
    console.log(`${status} ${name}`);
    
    this.results.tests.push({ name, status: condition, critical });
    
    if (condition) {
      this.results.passed++;
    } else if (critical) {
      this.results.failed++;
    } else {
      this.results.warnings++;
    }
  }

  async testFileStructure() {
    console.log('\n📁 Testing File Structure...');
    
    const requiredFiles = [
      'package.json',
      'server.js',
      'index.html',
      'admin.html',
      'login.html',
      'style.css',
      'render.yaml',
      '.env.example',
      '.gitignore',
      'README.md'
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        this.test(`${file} exists`, true);
      } catch {
        this.test(`${file} exists`, false);
      }
    }

    // Test assets directory
    try {
      const assetFiles = [
        'assets/js/chat-loader.js',
        'assets/js/ai-brain.js', 
        'assets/js/telegram-bot.js',
        'assets/js/utils.js'
      ];
      
      for (const file of assetFiles) {
        try {
          await fs.access(file);
          this.test(`${file} exists`, true);
        } catch {
          this.test(`${file} exists`, false);
        }
      }
    } catch {
      this.test('Assets directory structure', false);
    }
  }

  async testEnvironmentVariables() {
    console.log('\n🔧 Testing Environment Configuration...');
    
    require('dotenv').config();
    
    this.test('NODE_ENV set', !!process.env.NODE_ENV);
    this.test('OPENAI_API_KEY set', !!process.env.OPENAI_API_KEY);
    this.test('TELEGRAM_BOT_TOKEN set', !!process.env.TELEGRAM_BOT_TOKEN);
    this.test('ADMIN_TELEGRAM_ID set', !!process.env.ADMIN_TELEGRAM_ID);
    this.test('RENDER_EXTERNAL_URL set', !!process.env.RENDER_EXTERNAL_URL);
    
    // Check API key format
    if (process.env.OPENAI_API_KEY) {
      this.test('OpenAI API key format', process.env.OPENAI_API_KEY.startsWith('sk-'));
    }
    
    // Check Telegram ID format
    if (process.env.ADMIN_TELEGRAM_ID) {
      this.test('Telegram ID format', /^\d+$/.test(process.env.ADMIN_TELEGRAM_ID));
    }
  }

  async testPackageJson() {
    console.log('\n📦 Testing Package Configuration...');
    
    try {
      const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      
      this.test('Package.json valid JSON', true);
      this.test('Has start script', !!pkg.scripts?.start);
      this.test('Has required dependencies', !!(pkg.dependencies?.express && pkg.dependencies?.openai));
      this.test('Node version specified', !!pkg.engines?.node);
      
      // Check for all required dependencies
      const requiredDeps = [
        'express', 'cors', 'helmet', 'express-rate-limit',
        'express-validator', 'dotenv', 'openai', 'node-telegram-bot-api',
        'uuid', 'moment'
      ];
      
      const missingDeps = requiredDeps.filter(dep => !pkg.dependencies[dep]);
      this.test('All dependencies present', missingDeps.length === 0);
      
      if (missingDeps.length > 0) {
        console.log(`   Missing: ${missingDeps.join(', ')}`);
      }
      
    } catch (error) {
      this.test('Package.json readable', false);
    }
  }

  async testDataFiles() {
    console.log('\n💾 Testing Data Files...');
    
    const dataFiles = [
      'chat-log.json',
      'knowledge-base.json', 
      'analytics.json',
      'admin-sessions.json'
    ];

    for (const file of dataFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        JSON.parse(content);
        this.test(`${file} valid JSON`, true);
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.test(`${file} exists`, false, false); // Warning, not critical
        } else {
          this.test(`${file} valid JSON`, false);
        }
      }
    }
  }

  async testStaticAssets() {
    console.log('\n🎨 Testing Static Assets...');
    
    // Test HTML files for UTF-8 encoding
    const htmlFiles = ['index.html', 'admin.html', 'login.html'];
    
    for (const file of htmlFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        this.test(`${file} UTF-8 encoding`, content.includes('charset="UTF-8"'));
        this.test(`${file} has viewport meta`, content.includes('viewport'));
        this.test(`${file} has title`, content.includes('<title>'));
      } catch {
        this.test(`${file} readable`, false);
      }
    }

    // Test CSS file
    try {
      const cssContent = await fs.readFile('style.css', 'utf8');
      this.test('CSS file readable', true);
      this.test('CSS has root variables', cssContent.includes(':root'));
      this.test('CSS has responsive design', cssContent.includes('@media'));
    } catch {
      this.test('style.css readable', false);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('🎯 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`✅ PASSED: ${this.results.passed}`);
    console.log(`❌ FAILED: ${this.results.failed}`);
    console.log(`⚠️ WARNINGS: ${this.results.warnings}`);
    
    const totalTests = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / totalTests) * 100);
    
    console.log(`📊 SUCCESS RATE: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 ALL CRITICAL TESTS PASSED - SYSTEM IS PRODUCTION READY!');
      console.log('🚀 Ready for GitHub deployment and Render hosting.');
    } else {
      console.log('\n❌ CRITICAL ISSUES FOUND - PLEASE FIX BEFORE DEPLOYMENT');
      const failedTests = this.results.tests.filter(t => !t.status && t.critical);
      failedTests.forEach(test => console.log(`   - ${test.name}`));
    }
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Fix any critical issues above');
    console.log('2. git add . && git commit -m "🚀 Production ready"');
    console.log('3. git push origin main');
    console.log('4. Deploy to Render with environment variables');
    console.log('5. Set up UptimeRobot monitoring');
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new SystemTester();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = SystemTester;
