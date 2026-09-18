import { describe, it, expect } from 'vitest';
import {
  cleanSurveyDataset,
  isTestRecord,
  maskEmail,
  maskRewardAccount,
  normalizeBackground,
  parseMultiSelect,
  type RawSurveyRecord,
} from '../../src/lib/survey/data-cleaner';

describe('Data Cleansing & Analytics Engine', () => {
  it('nhận diện đúng các dòng test/kỹ thuật cần loại bỏ', () => {
    const testRow: RawSurveyRecord = {
      timestamp: '2026-09-17 13:10:00',
      studentId: 'TEST001',
      fullName: 'Nguyen Test',
      email: 'test@example.com',
      background: 'Dân Công nghệ',
      rewardAccount: '0987654321',
      selfAwarenessOfGaps: 'Tôi tự biết rõ',
      primaryPainPoints: 'Slide dài',
      timeWasted: '15-30p',
      currentWorkarounds: 'ChatGPT',
      solutionFeasibility: 'Khả thi',
      wantPersonalizedRoadmap: 'Có',
      wantAiGapFilling: 'Có',
      mostWantedFeatures: 'Test chẩn đoán',
      overallRating: 5,
      usabilityRating: 'Đẹp',
      uiImprovements: 'Ổn',
      willingToTest: 'Có',
    };

    expect(isTestRecord(testRow)).toBe(true);
  });

  it('ẩn danh hóa email và thông tin tài khoản an toàn', () => {
    expect(maskEmail('hocvien.cntt@gmail.com')).toBe('hoc***@gmail.com');
    expect(maskEmail('student@vinuni.edu.vn')).toBe('stu***@vinuni.edu.vn');
    expect(maskRewardAccount('MoMo 0918424356')).toBe('MoMo •••• 4356');
    expect(maskRewardAccount('MB Bank 0792688888')).toBe('Ngân hàng •••• 8888');
  });

  it('chuẩn hóa nền tảng học viên chính xác', () => {
    expect(normalizeBackground('Đang theo chuyên sâu về Data / AI').category).toBe('data_ai');
    expect(normalizeBackground('Người học trái ngành (Chưa từng học code)').category).toBe('non_tech');
    expect(normalizeBackground('Dân Công nghệ thông tin (Đã biết lập trình)').category).toBe('it');
  });

  it('bóc tách mảng multi-select từ chuỗi bullet points', () => {
    const input = '• Slide quá dài (50-60 trang)\n• Tài liệu bị vứt rải rác nhiều nơi';
    const parsed = parseMultiSelect(input);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toContain('Slide quá dài');
    expect(parsed[1]).toContain('Tài liệu bị vứt rải rác');
  });

  it('khử trùng lặp và tính toán chính xác cỡ mẫu sạch', () => {
    const rawList: RawSurveyRecord[] = [
      {
        timestamp: '2026-09-17 13:00:00',
        studentId: '2733',
        fullName: 'Nguyễn Văn A',
        email: 'hocvien.a@gmail.com',
        background: 'Dân Công nghệ thông tin',
        rewardAccount: 'MoMo 0912345678',
        selfAwarenessOfGaps: 'Hoàn toàn không biết',
        primaryPainPoints: ['Slide quá dài'],
        timeWasted: '15-30 phút',
        currentWorkarounds: ['AI ngoài'],
        solutionFeasibility: 'Rất thiết thực',
        wantPersonalizedRoadmap: 'Có',
        wantAiGapFilling: 'Có',
        mostWantedFeatures: ['Test chẩn đoán'],
        overallRating: 5,
        usabilityRating: 'Đẹp',
        uiImprovements: ['Ổn'],
        willingToTest: 'Sẵn sàng!',
        generalFeedback: 'Nhận xét ngắn',
      },
      {
        timestamp: '2026-09-17 13:30:00',
        studentId: '2733',
        fullName: 'Nguyễn Văn A',
        email: 'hocvien.a@gmail.com',
        background: 'Dân Công nghệ thông tin',
        rewardAccount: 'MoMo 0912345678',
        selfAwarenessOfGaps: 'Hoàn toàn không biết',
        primaryPainPoints: ['Slide quá dài', 'Tài liệu rải rác'],
        timeWasted: '15-30 phút',
        currentWorkarounds: ['AI ngoài'],
        solutionFeasibility: 'Rất thiết thực',
        wantPersonalizedRoadmap: 'Có',
        wantAiGapFilling: 'Có',
        mostWantedFeatures: ['Test chẩn đoán', 'Checklist 3 việc'],
        overallRating: 5,
        usabilityRating: 'Đẹp',
        uiImprovements: ['Ổn'],
        willingToTest: 'Sẵn sàng!',
        generalFeedback: 'Nhận xét dài và đầy đủ hơn cho bản ghi sau',
      },
      {
        timestamp: '2026-09-17 13:10:00',
        studentId: 'TEST001',
        fullName: 'Nguyen Test',
        email: 'test@example.com',
        background: 'Dân Công nghệ',
        rewardAccount: '0987654321',
        selfAwarenessOfGaps: 'Tôi tự biết rõ',
        primaryPainPoints: 'Slide dài',
        timeWasted: '15-30p',
        currentWorkarounds: 'ChatGPT',
        solutionFeasibility: 'Khả thi',
        wantPersonalizedRoadmap: 'Có',
        wantAiGapFilling: 'Có',
        mostWantedFeatures: 'Test chẩn đoán',
        overallRating: 5,
        usabilityRating: 'Đẹp',
        uiImprovements: 'Ổn',
        willingToTest: 'Có',
      },
    ];

    const report = cleanSurveyDataset(rawList);
    expect(report.hygiene.totalRawCount).toBe(3);
    expect(report.hygiene.testRecordsRemoved).toBe(1);
    expect(report.hygiene.duplicatesMerged).toBe(1);
    expect(report.hygiene.validCleanCount).toBe(1);
    expect(report.records[0]?.generalFeedback).toContain('đầy đủ hơn');
  });
});
