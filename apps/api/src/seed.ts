/**
 * RSE Platform — Database Seed Script
 * Run: npx ts-node src/seed.ts
 * Seeds: RSE-listed securities, sample brokers, admin user
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Security, SecurityType, SecurityStatus } from './modules/securities/security.entity';
import { User, UserRole, UserStatus } from './modules/users/user.entity';
import { Broker, BrokerStatus } from './modules/brokers/broker.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const securityRepo: Repository<Security> = app.get(getRepositoryToken(Security));
  const userRepo: Repository<User> = app.get(getRepositoryToken(User));
  const brokerRepo: Repository<Broker> = app.get(getRepositoryToken(Broker));

  console.log('🌱 Seeding RSE Platform database...');

  // ── Securities ──────────────────────────────────────────────────────────────
  const securities = [
    { ticker: 'BK', companyName: 'Bank of Kigali Group PLC', isin: 'RW000A1H63L5', type: SecurityType.EQUITY, sector: 'Banking', currentPrice: 328.00, previousClose: 325.00, openPrice: 326.00, highPrice: 330.00, lowPrice: 324.00, sharesOutstanding: 534000000, marketCap: 175152000000, dividendYield: 3.05, volume: 45230, currency: 'RWF', description: 'Bank of Kigali is the largest bank in Rwanda by assets, offering retail, corporate, and investment banking services.' },
    { ticker: 'MTN', companyName: 'MTN Rwanda PLC', isin: 'RW000A2YDS77', type: SecurityType.EQUITY, sector: 'Telecommunications', currentPrice: 180.00, previousClose: 178.00, openPrice: 179.00, highPrice: 182.00, lowPrice: 177.00, sharesOutstanding: 2000000000, marketCap: 360000000000, dividendYield: 4.44, volume: 120500, currency: 'RWF', description: 'MTN Rwanda is the leading mobile telecommunications provider in Rwanda, offering voice, data, and mobile financial services.' },
    { ticker: 'BRALIRWA', companyName: 'Bralirwa PLC', isin: 'RW000A0ZKHY4', type: SecurityType.EQUITY, sector: 'Consumer Goods', currentPrice: 165.00, previousClose: 163.00, openPrice: 164.00, highPrice: 167.00, lowPrice: 162.00, sharesOutstanding: 378000000, marketCap: 62370000000, dividendYield: 5.00, volume: 32100, currency: 'RWF', description: 'Bralirwa is Rwanda\'s leading beverage company, producing Primus beer, Amstel, and Coca-Cola products.' },
    { ticker: 'KCB', companyName: 'KCB Group PLC (Rwanda)', isin: 'KE0000000315', type: SecurityType.EQUITY, sector: 'Banking', currentPrice: 38.50, previousClose: 38.00, openPrice: 38.25, highPrice: 39.00, lowPrice: 37.80, sharesOutstanding: 3210000000, marketCap: 123585000000, dividendYield: 2.10, volume: 15800, currency: 'RWF', isCrossListed: true, primaryExchange: 'NSE', description: 'KCB Group is East Africa\'s largest commercial bank, cross-listed on the Rwanda Stock Exchange.' },
    { ticker: 'EQUITY', companyName: 'Equity Group Holdings (Rwanda)', isin: 'KE0000000554', type: SecurityType.EQUITY, sector: 'Banking', currentPrice: 48.00, previousClose: 47.50, openPrice: 47.75, highPrice: 48.50, lowPrice: 47.00, sharesOutstanding: 3773675510, marketCap: 181136424480, dividendYield: 1.56, volume: 9200, currency: 'RWF', isCrossListed: true, primaryExchange: 'NSE', description: 'Equity Group Holdings is a leading pan-African financial services institution, cross-listed on the RSE.' },
    { ticker: 'SAFARICOM', companyName: 'Safaricom PLC (Rwanda)', isin: 'KE1000001402', type: SecurityType.EQUITY, sector: 'Telecommunications', currentPrice: 22.00, previousClose: 22.50, openPrice: 22.25, highPrice: 22.75, lowPrice: 21.80, sharesOutstanding: 40064568521, marketCap: 881420507462, dividendYield: 6.50, volume: 8400, currency: 'RWF', isCrossListed: true, primaryExchange: 'NSE', description: 'Safaricom is East Africa\'s largest telecom and fintech company, operator of M-Pesa. Cross-listed on RSE.' },
    { ticker: 'NATION', companyName: 'Nation Media Group (Rwanda)', isin: 'KE0000000356', type: SecurityType.EQUITY, sector: 'Media', currentPrice: 22.50, previousClose: 22.00, openPrice: 22.25, highPrice: 23.00, lowPrice: 21.90, sharesOutstanding: 188542286, marketCap: 4242201435, dividendYield: 3.20, volume: 3100, currency: 'RWF', isCrossListed: true, primaryExchange: 'NSE', description: 'Nation Media Group is East Africa\'s largest media conglomerate, cross-listed on the RSE.' },
    { ticker: 'GOK2034', companyName: 'Republic of Rwanda Treasury Bond 2034', isin: 'RW000A2YDS99', type: SecurityType.BOND, sector: 'Government', currentPrice: 1000.00, previousClose: 1000.00, openPrice: 1000.00, highPrice: 1001.00, lowPrice: 999.00, sharesOutstanding: 5000000, marketCap: 5000000000, dividendYield: 9.50, volume: 2200, currency: 'RWF', description: 'Republic of Rwanda 10-year Treasury Bond maturing 2034, coupon rate 9.5% per annum, semi-annual payments.' },
  ];

  for (const s of securities) {
    const exists = await securityRepo.findOne({ where: { ticker: s.ticker } });
    if (!exists) {
      await securityRepo.save(securityRepo.create({ ...s, status: SecurityStatus.ACTIVE }));
      console.log(`  ✓ Security seeded: ${s.ticker}`);
    }
  }

  // ── Admin User ──────────────────────────────────────────────────────────────
  const adminEmail = 'admin@rse.rw';
  const adminExists = await userRepo.findOne({ where: { email: adminEmail } });
  if (!adminExists) {
    const admin = await userRepo.save(userRepo.create({
      email: adminEmail,
      password: await bcrypt.hash('Admin@RSE2024!', 12),
      firstName: 'RSE',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    }));
    console.log(`  ✓ Admin user: ${adminEmail}`);
  }

  // ── Broker Users & Profiles ──────────────────────────────────────────────────
  const brokerData = [
    {
      email: 'info@africafinancial.rw',
      firstName: 'Robert', lastName: 'Kamanzi',
      firmName: 'Africa Financial Services Ltd',
      licenseNumber: 'CMA/LB/001/2020',
      district: 'Kigali', commissionRate: 1.0,
      description: 'A leading full-service brokerage offering equity, bond and portfolio management services to retail and institutional clients across East Africa.',
      officeAddress: 'KG 11 Ave, Kiyovu, Kigali',
      specializations: ['Equities', 'Bonds', 'Portfolio Management'],
    },
    {
      email: 'trade@imara.rw',
      firstName: 'Grace', lastName: 'Uwimana',
      firmName: 'Imara Securities Rwanda',
      licenseNumber: 'CMA/LB/002/2021',
      district: 'Kigali', commissionRate: 1.2,
      description: 'Imara Securities provides premier stockbroking and investment advisory services with a focus on corporate clients and HNWIs.',
      officeAddress: 'KN 4 Ave, Nyarugenge, Kigali',
      specializations: ['Equities', 'Cross-Listed Securities', 'Advisory'],
    },
    {
      email: 'brokers@kigalicapital.rw',
      firstName: 'Jean', lastName: 'Ndagijimana',
      firmName: 'Kigali Capital Markets Ltd',
      licenseNumber: 'CMA/LB/003/2021',
      district: 'Kigali', commissionRate: 0.85,
      description: 'Kigali Capital Markets offers competitive brokerage rates for institutional investors and pension funds. Specialists in bond markets.',
      officeAddress: 'KG 7 Ave, Remera, Kigali',
      specializations: ['Bonds', 'Institutional', 'Pension Funds'],
    },
  ];

  for (const b of brokerData) {
    const existingUser = await userRepo.findOne({ where: { email: b.email } });
    if (!existingUser) {
      const user = await userRepo.save(userRepo.create({
        email: b.email,
        password: await bcrypt.hash('Broker@RSE2024!', 12),
        firstName: b.firstName,
        lastName: b.lastName,
        role: UserRole.BROKER,
        status: UserStatus.ACTIVE,
      }));
      await brokerRepo.save(brokerRepo.create({
        userId: user.id,
        firmName: b.firmName,
        licenseNumber: b.licenseNumber,
        status: BrokerStatus.LICENSED,
        district: b.district,
        commissionRate: b.commissionRate,
        description: b.description,
        officeAddress: b.officeAddress,
        specializations: b.specializations,
        licenseExpiryDate: new Date('2026-12-31'),
        totalClients: Math.floor(Math.random() * 150) + 20,
        totalTrades: Math.floor(Math.random() * 500) + 50,
      }));
      console.log(`  ✓ Broker seeded: ${b.firmName}`);
    }
  }

  console.log('\n✅ Seed complete!');
  console.log('   Admin login:  admin@rse.rw / Admin@RSE2024!');
  console.log('   Broker login: info@africafinancial.rw / Broker@RSE2024!');
  await app.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
