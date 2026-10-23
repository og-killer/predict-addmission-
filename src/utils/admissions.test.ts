import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAggregate,
  checkEligibility,
  predictChances,
  searchUniversities,
  generateStudyPlan
} from './admissions.js';
import { PAK_UNIVERSITIES } from '../data/universities.js';

test('calculateAggregate: NUST formula (NET 75% + FSc 15% + Matric 10%)', () => {
  // Student with Matric 950/1100 (86.36%), FSc 440/520 (84.62%), NET 150/200 (75%)
  const agg = calculateAggregate('nust-formula', {
    matricObtained: 950,
    matricTotal: 1100,
    fscObtained: 440,
    fscTotal: 520,
    testObtained: 150,
    testTotal: 200
  });

  // Expected:
  // matricPct = 86.3636 * 0.10 = 8.636
  // fscPct = 84.615 * 0.15 = 12.692
  // testPct = 75.0 * 0.75 = 56.25
  // Total ~ 77.58%
  assert.ok(agg > 77.0 && agg < 78.0);
  assert.equal(typeof agg, 'number');
});

test('calculateAggregate: FAST formula (NU Test 50% + FSc 50%)', () => {
  const agg = calculateAggregate('fast-formula', {
    matricObtained: 900,
    matricTotal: 1100,
    fscObtained: 800,
    fscTotal: 1100, // 72.727%
    testObtained: 70,
    testTotal: 100 // 70.0%
  });

  // Expected: 70 * 0.5 + 72.727 * 0.5 = 35 + 36.3636 = 71.36%
  assert.equal(agg, 71.36);
});

test('calculateAggregate: PMDC MDCAT formula (MDCAT 50% + FSc 40% + Matric 10%)', () => {
  const agg = calculateAggregate('pmdc-formula', {
    matricObtained: 1000,
    matricTotal: 1100, // 90.909%
    fscObtained: 1020,
    fscTotal: 1100, // 92.727%
    testObtained: 180,
    testTotal: 200 // 90.0%
  });

  // Expected: 90.909 * 0.10 + 92.727 * 0.40 + 90 * 0.50 = 9.091 + 37.091 + 45.0 = 91.18%
  assert.ok(agg >= 91.1 && agg <= 91.3);
});

test('checkEligibility: identifies minimum FSc requirement correctly', () => {
  const nustCs = PAK_UNIVERSITIES[0].programs[0]; // requires min 60%
  const eligibleStudent = {
    matricObtained: 850,
    matricTotal: 1100,
    fscObtained: 750,
    fscTotal: 1100, // 68.18%
    fscGroup: 'Pre-Engineering' as const
  };

  const inEligibleStudent = {
    matricObtained: 850,
    matricTotal: 1100,
    fscObtained: 550,
    fscTotal: 1100, // 50% < 60%
    fscGroup: 'Pre-Engineering' as const
  };

  assert.equal(checkEligibility(eligibleStudent, nustCs).eligible, true);
  assert.equal(checkEligibility(inEligibleStudent, nustCs).eligible, false);
});

test('predictChances: returns correct chance categories based on 2024 closing merit', () => {
  // Closing merit 78.45%
  const highChance = predictChances(81.0, 78.45);
  assert.equal(highChance.status, 'High Chance');
  assert.ok(highChance.diff > 0);

  const moderateChance = predictChances(78.50, 78.45);
  assert.equal(moderateChance.status, 'Moderate Chance');

  const reachChance = predictChances(74.0, 78.45);
  assert.equal(reachChance.status, 'Reach / Competitive');
  assert.ok(reachChance.diff < 0);
});

test('searchUniversities: searches by province and program discipline', () => {
  const sindhUnis = searchUniversities('', { province: 'Sindh' });
  assert.ok(sindhUnis.length >= 2);
  assert.ok(sindhUnis.every(u => u.university.province === 'Sindh'));

  const csUnis = searchUniversities('Computer Science');
  assert.ok(csUnis.length >= 3);
});

test('generateStudyPlan: produces weekly breakdown with milestones and key strategies', () => {
  const plan = generateStudyPlan('NUST NET', 30, ['Physics', 'Conic Sections']);
  assert.equal(plan.testName, 'NUST NET');
  assert.equal(plan.weeklySchedule.length, 4);
  assert.ok(plan.keyStrategies.length >= 3);
});
