/**
 * Engine Lam Sach & Phan Tich Du Lieu Khao Sat (Data Cleansing & Analytics Engine)
 * Du an: AI Diagnostic Study Planner - Nhom Vinonymus (Track E)
 * 
 * Muc tieu:
 * 1. Loc bo cac luot dien thu nghiem (TEST, DEBUG, rac).
 * 2. Khu trung lap (Deduplication) khi hoc vien gui nhieu lan.
 * 3. Chuan hoa phan loai nguoi hoc, boc tach mang binh chon tinh nang & kho khan.
 * 4. An danh hoa (Masking) thong tin ca nhan (Email, MoMo/STK) bao ve quyen rieng tu.
 * 5. Tinh toan cac chi so thong ke & xep hang phuc vu bao cao thuc chung cho ban giam khao.
 */

export interface RawSurveyRecord {
  timestamp: string;
  studentId: string;
  fullName: string;
  email: string;
  background: string;
  rewardAccount: string;
  selfAwarenessOfGaps: string;
  primaryPainPoints: string | string[];
  timeWasted: string;
  currentWorkarounds: string | string[];
  solutionFeasibility: string;
  wantPersonalizedRoadmap: string;
  wantAiGapFilling: string;
  mostWantedFeatures: string | string[];
  overallRating: number | string;
  usabilityRating: string;
  uiImprovements: string | string[];
  willingToTest: string;
  generalFeedback?: string;
  contactHandle?: string;
}

export interface CleanedSurveyRecord {
  id: string;
  timestamp: string;
  studentId: string;
  fullName: string;
  maskedEmail: string;
  maskedReward: string;
  backgroundCategory: 'it' | 'non_tech' | 'data_ai';
  backgroundLabel: string;
  selfAwarenessCategory: 'unaware' | 'aware_stuck' | 'self_sufficient';
  selfAwarenessLabel: string;
  painPoints: string[];
  timeWastedMinutes: number;
  timeWastedLabel: string;
  workarounds: string[];
  solutionFeasibility: string;
  wantPersonalizedRoadmap: boolean;
  wantAiGapFilling: boolean;
  mostWantedFeatures: string[];
  overallRating: number;
  usabilityRating: string;
  uiImprovements: string[];
  willingToTest: boolean;
  generalFeedback: string;
}

export interface SurveyAnalyticsReport {
  hygiene: {
    totalRawCount: number;
    testRecordsRemoved: number;
    duplicatesMerged: number;
    validCleanCount: number;
    dataIntegrityRate: number;
  };
  kpis: {
    averageRating: number;
    unawareGapsPercent: number;
    timeWastedOver15MinPercent: number;
    willingToTestPercent: number;
    feasibilityHighPercent: number;
  };
  backgroundDistribution: {
    category: 'it' | 'non_tech' | 'data_ai';
    label: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  painPointsRanking: {
    id: string;
    label: string;
    shortLabel: string;
    count: number;
    percentage: number;
  }[];
  timeWastedDistribution: {
    label: string;
    count: number;
    percentage: number;
  }[];
  featuresRanking: {
    id: string;
    label: string;
    shortLabel: string;
    count: number;
    percentage: number;
  }[];
  featuredFeedbacks: {
    studentCode: string;
    backgroundLabel: string;
    feedback: string;
    rating: number;
  }[];
  records: CleanedSurveyRecord[];
}

export function isTestRecord(record: RawSurveyRecord): boolean {
  const combined = `${record.studentId} ${record.fullName} ${record.email} ${record.generalFeedback || ''}`.toLowerCase();
  
  const testKeywords = [
    'test001',
    'vin-mkt',
    'vin-edu',
    'test-debug',
    'test agent',
    'nguyen test',
    'thử nghiệm gửi lại',
    'dòng test kỹ thuật',
    'test webhook'
  ];

  for (const kw of testKeywords) {
    if (combined.includes(kw)) {
      return true;
    }
  }

  if (!record.studentId || record.studentId.trim().length < 2) return true;
  if (!record.fullName || record.fullName.trim().length < 2) return true;

  return false;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'Học viên ẩn danh';
  const parts = email.split('@');
  const user = parts[0] || '';
  const domain = parts[1] || 'vinuni.edu.vn';
  if (user.length <= 3) {
    return `${user.charAt(0)}***@${domain}`;
  }
  return `${user.slice(0, 3)}***@${domain}`;
}

export function maskRewardAccount(account: string): string {
  if (!account) return 'Đã bảo mật';
  const trimmed = account.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 4) {
    const last4 = digits.slice(-4);
    if (/momo/i.test(trimmed)) {
      return `MoMo •••• ${last4}`;
    }
    return `Ngân hàng •••• ${last4}`;
  }
  return 'Tài khoản đã bảo mật';
}

export function normalizeBackground(bg: string): { category: 'it' | 'non_tech' | 'data_ai'; label: string } {
  const lower = (bg || '').toLowerCase();
  if (lower.includes('chuyên sâu') || lower.includes('data') || lower.includes('ai')) {
    return { category: 'data_ai', label: 'Chuyên sâu Data / AI' };
  }
  if (lower.includes('trái ngành') || lower.includes('chưa từng')) {
    return { category: 'non_tech', label: 'Người học trái ngành' };
  }
  return { category: 'it', label: 'Đã biết lập trình (CNTT)' };
}

export function parseMultiSelect(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((s) => s.replace(/^[•\s-]+/, '').trim()).filter(Boolean);
  }
  return value
    .split(/\n|•/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

export function cleanSurveyDataset(rawList: RawSurveyRecord[]): SurveyAnalyticsReport {
  const totalRawCount = rawList.length;
  let testRecordsRemoved = 0;
  let duplicatesMerged = 0;

  const nonTestRecords: RawSurveyRecord[] = [];
  for (const item of rawList) {
    if (isTestRecord(item)) {
      testRecordsRemoved++;
    } else {
      nonTestRecords.push(item);
    }
  }

  const dedupMap = new Map<string, RawSurveyRecord>();
  for (const item of nonTestRecords) {
    const idMatch = item.studentId.match(/\d{3,6}/);
    const normalizedKey = idMatch ? idMatch[0] : item.studentId.trim().toLowerCase();
    const existing = dedupMap.get(normalizedKey);

    if (!existing) {
      dedupMap.set(normalizedKey, item);
    } else {
      duplicatesMerged++;
      const currentFeedbackLen = (item.generalFeedback || '').length;
      const existingFeedbackLen = (existing.generalFeedback || '').length;
      if (currentFeedbackLen > existingFeedbackLen || item.timestamp > existing.timestamp) {
        dedupMap.set(normalizedKey, item);
      }
    }
  }

  const cleanedRecords: CleanedSurveyRecord[] = [];
  let idCounter = 1;

  for (const raw of dedupMap.values()) {
    const idMatch = raw.studentId.match(/\d{3,6}/);
    const cleanStudentId = idMatch ? idMatch[0] : raw.studentId.trim();

    let cleanFullName = raw.fullName.trim();
    if (raw.studentId.includes(' ') && cleanFullName.length < 4) {
      const parts = raw.studentId.split(/\s+/);
      const secondPart = parts[1];
      if (parts.length > 1 && secondPart && secondPart.length > 1) {
        cleanFullName = parts.slice(1).join(' ').toUpperCase();
      }
    }

    const bgInfo = normalizeBackground(raw.background);
    const painPoints = parseMultiSelect(raw.primaryPainPoints);
    const workarounds = parseMultiSelect(raw.currentWorkarounds);
    const wantedFeatures = parseMultiSelect(raw.mostWantedFeatures);
    const uiImprovements = parseMultiSelect(raw.uiImprovements);

    let timeMinutes = 25;
    const timeLower = (raw.timeWasted || '').toLowerCase();
    if (timeLower.includes('dưới 15') || timeLower.includes('< 15')) timeMinutes = 10;
    else if (timeLower.includes('15 đến 30') || timeLower.includes('15-30')) timeMinutes = 22;
    else if (timeLower.includes('30 đến 45') || timeLower.includes('30-45')) timeMinutes = 38;
    else if (timeLower.includes('trên 45') || timeLower.includes('> 45')) timeMinutes = 55;

    let selfAwarenessCategory: 'unaware' | 'aware_stuck' | 'self_sufficient' = 'unaware';
    const gapLower = (raw.selfAwarenessOfGaps || '').toLowerCase();
    if (gapLower.includes('hoàn toàn không') || gapLower.includes('lỗi hoặc') || gapLower.includes('fail')) {
      selfAwarenessCategory = 'unaware';
    } else if (gapLower.includes('chưa hiểu') || gapLower.includes('chịu không biết')) {
      selfAwarenessCategory = 'aware_stuck';
    } else {
      selfAwarenessCategory = 'self_sufficient';
    }

    const ratingNum = Math.min(5, Math.max(1, parseInt(String(raw.overallRating), 10) || 5));
    const isWilling = /(sẵn sàng|rất muốn|có)/i.test(raw.willingToTest || 'sẵn sàng');
    const wantRoadmap = /(có|rất muốn|muốn dùng thử)/i.test(raw.wantPersonalizedRoadmap || 'có');
    const wantGapFill = /(có|rất cần)/i.test(raw.wantAiGapFilling || 'có');

    cleanedRecords.push({
      id: `SV-${String(idCounter++).padStart(3, '0')}`,
      timestamp: raw.timestamp,
      studentId: cleanStudentId,
      fullName: cleanFullName,
      maskedEmail: maskEmail(raw.email),
      maskedReward: maskRewardAccount(raw.rewardAccount),
      backgroundCategory: bgInfo.category,
      backgroundLabel: bgInfo.label,
      selfAwarenessCategory,
      selfAwarenessLabel: raw.selfAwarenessOfGaps || 'Chưa rõ',
      painPoints,
      timeWastedMinutes: timeMinutes,
      timeWastedLabel: raw.timeWasted || '15 – 30 phút',
      workarounds,
      solutionFeasibility: raw.solutionFeasibility || 'Rất thiết thực',
      wantPersonalizedRoadmap: wantRoadmap,
      wantAiGapFilling: wantGapFill,
      mostWantedFeatures: wantedFeatures,
      overallRating: ratingNum,
      usabilityRating: raw.usabilityRating || 'Đẹp và rất dễ dùng',
      uiImprovements,
      willingToTest: isWilling,
      generalFeedback: (raw.generalFeedback || '').trim()
    });
  }

  const validCleanCount = cleanedRecords.length;
  const dataIntegrityRate = totalRawCount > 0 ? Math.round((validCleanCount / totalRawCount) * 100) : 100;

  const totalRatingSum = cleanedRecords.reduce((sum, r) => sum + r.overallRating, 0);
  const averageRating = validCleanCount > 0 ? Number((totalRatingSum / validCleanCount).toFixed(2)) : 5.0;

  const unawareCount = cleanedRecords.filter((r) => r.selfAwarenessCategory === 'unaware').length;
  const unawareGapsPercent = validCleanCount > 0 ? Math.round((unawareCount / validCleanCount) * 100) : 0;

  const timeOver15Count = cleanedRecords.filter((r) => r.timeWastedMinutes >= 20).length;
  const timeWastedOver15MinPercent = validCleanCount > 0 ? Math.round((timeOver15Count / validCleanCount) * 100) : 0;

  const willingCount = cleanedRecords.filter((r) => r.willingToTest).length;
  const willingToTestPercent = validCleanCount > 0 ? Math.round((willingCount / validCleanCount) * 100) : 0;

  const feasibilityCount = cleanedRecords.filter((r) => r.solutionFeasibility.includes('Rất thiết thực')).length;
  const feasibilityHighPercent = validCleanCount > 0 ? Math.round((feasibilityCount / validCleanCount) * 100) : 0;

  const bgCounts = { it: 0, non_tech: 0, data_ai: 0 };
  for (const r of cleanedRecords) {
    bgCounts[r.backgroundCategory]++;
  }

  const backgroundDistribution = [
    {
      category: 'data_ai' as const,
      label: 'Chuyên sâu Data / AI',
      count: bgCounts.data_ai,
      percentage: validCleanCount > 0 ? Math.round((bgCounts.data_ai / validCleanCount) * 100) : 0,
      color: 'from-amber-500 to-amber-600'
    },
    {
      category: 'it' as const,
      label: 'Đã biết lập trình (CNTT)',
      count: bgCounts.it,
      percentage: validCleanCount > 0 ? Math.round((bgCounts.it / validCleanCount) * 100) : 0,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      category: 'non_tech' as const,
      label: 'Học viên trái ngành',
      count: bgCounts.non_tech,
      percentage: validCleanCount > 0 ? Math.round((bgCounts.non_tech / validCleanCount) * 100) : 0,
      color: 'from-rose-500 to-pink-500'
    }
  ];

  const painCounts = {
    slide: {
      count: 0,
      shortLabel: 'Slide quá dài (50-60 trang) đọc lan man',
      fullLabel: 'Slide bài giảng quá dài (50-60 trang), đọc lan man không rõ trọng tâm kiểm tra'
    },
    scattered: {
      count: 0,
      shortLabel: 'Tài liệu bị vứt rải rác nhiều kênh (Discord, Drive)',
      fullLabel: 'Tài liệu rải rác khắp nơi (Discord, VLearn, GitHub, Drive), mất công gom link'
    },
    tutor: {
      count: 0,
      shortLabel: 'Hỏi AI có sẵn nhưng trả lời chung chung',
      fullLabel: 'Hỏi trợ lý AI trên VLearn nhưng câu trả lời chung chung, không có bước tiếp theo'
    },
    time: {
      count: 0,
      shortLabel: 'Thời gian rảnh quá ít (< 1 tiếng)',
      fullLabel: 'Thời gian rảnh học quá ít (dưới 1 tiếng), không đủ mò mẫm từ đầu'
    },
    quiz: {
      count: 0,
      shortLabel: 'Thiếu bài test ngắn để tự kiểm tra kiến thức',
      fullLabel: 'Không có bài trắc nghiệm chẩn đoán nhanh xem mình đã hiểu bài hay chưa'
    },
    deadline: {
      count: 0,
      shortLabel: 'Cuống cuồng nộp bài sát hạn 23h59',
      fullLabel: 'Làm bài cập rập, đến sát hạn 23h59 mới cuống cuồng nộp bài hoặc bị nộp muộn'
    }
  };

  for (const r of cleanedRecords) {
    const text = r.painPoints.join(' ').toLowerCase();
    if (text.includes('slide') || text.includes('50-60')) painCounts.slide.count++;
    if (text.includes('rải rác') || text.includes('nhặt từng link')) painCounts.scattered.count++;
    if (text.includes('ai tutor') || text.includes('chung chung')) painCounts.tutor.count++;
    if (text.includes('thời gian rảnh') || text.includes('dưới 1 tiếng')) painCounts.time.count++;
    if (text.includes('test') || text.includes('trắc nghiệm') || text.includes('kiểm tra')) painCounts.quiz.count++;
    if (text.includes('23h59') || text.includes('sát hạn') || text.includes('muộn')) painCounts.deadline.count++;
  }

  const painPointsRanking = Object.entries(painCounts)
    .map(([id, val]) => ({
      id,
      label: val.fullLabel,
      shortLabel: val.shortLabel,
      count: val.count,
      percentage: validCleanCount > 0 ? Math.round((val.count / validCleanCount) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const featCounts = {
    diagnostic: {
      count: 0,
      shortLabel: 'Test chẩn đoán chỉ đúng lỗ hổng (AI Diagnostic Test)',
      fullLabel: 'AI Mentor: Bài test chẩn đoán ngắn chỉ ra chính xác mình đang yếu phần nào'
    },
    checklist: {
      count: 0,
      shortLabel: 'Checklist 3 việc trọng tâm theo phút rảnh',
      fullLabel: 'AI Mentor: Checklist 3 việc trọng tâm kèm ước lượng thời gian & lộ trình theo phút rảnh'
    },
    catalog: {
      count: 0,
      shortLabel: 'Gom sẵn link mẫu chuẩn catalog (không lo trôi link)',
      fullLabel: 'AI Mentor: Gom sẵn link repo mẫu, slide, link lab chuẩn catalog — bấm là mở ngay'
    },
    helpdesk: {
      count: 0,
      shortLabel: 'Trợ lý AI 24/7 gỡ kẹt kỹ thuật & quy chế tức thì',
      fullLabel: 'AI Helpdesk 24/7: Trợ lý hỏi đáp quy chế, giải thích bài lab và gỡ kẹt kỹ thuật tức thì'
    },
    deadline: {
      count: 0,
      shortLabel: 'Cảnh báo nguy cơ trễ deadline 23h59 & chuẩn SFIA',
      fullLabel: 'Cảnh báo nguy cơ trễ hạn nộp bài (deadline) & gợi ý lộ trình kỹ năng chuẩn SFIA'
    }
  };

  for (const r of cleanedRecords) {
    const text = r.mostWantedFeatures.join(' ').toLowerCase();
    if (text.includes('chẩn đoán') || text.includes('diagnostic')) featCounts.diagnostic.count++;
    if (text.includes('checklist') || text.includes('3 việc')) featCounts.checklist.count++;
    if (text.includes('catalog') || text.includes('gom sẵn') || text.includes('repo mẫu')) featCounts.catalog.count++;
    if (text.includes('helpdesk') || text.includes('gỡ kẹt') || text.includes('24/7')) featCounts.helpdesk.count++;
    if (text.includes('deadline') || text.includes('sfia') || text.includes('trễ hạn')) featCounts.deadline.count++;
  }

  const featuresRanking = Object.entries(featCounts)
    .map(([id, val]) => ({
      id,
      label: val.fullLabel,
      shortLabel: val.shortLabel,
      count: val.count,
      percentage: validCleanCount > 0 ? Math.round((val.count / validCleanCount) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const timeBuckets = {
    under15: { label: 'Dưới 15 phút', count: 0 },
    under30: { label: 'Từ 15 đến 30 phút', count: 0 },
    under45: { label: 'Từ 30 đến 45 phút', count: 0 },
    over45: { label: 'Trên 45 phút', count: 0 }
  };

  for (const r of cleanedRecords) {
    if (r.timeWastedMinutes <= 15) timeBuckets.under15.count++;
    else if (r.timeWastedMinutes <= 30) timeBuckets.under30.count++;
    else if (r.timeWastedMinutes <= 45) timeBuckets.under45.count++;
    else timeBuckets.over45.count++;
  }

  const timeWastedDistribution = Object.values(timeBuckets).map((item) => ({
    label: item.label,
    count: item.count,
    percentage: validCleanCount > 0 ? Math.round((item.count / validCleanCount) * 100) : 0
  }));

  const featuredFeedbacks = cleanedRecords
    .filter((r) => r.generalFeedback && r.generalFeedback.length > 15)
    .slice(0, 6)
    .map((r) => ({
      studentCode: `Học viên ${r.studentId}`,
      backgroundLabel: r.backgroundLabel,
      feedback: r.generalFeedback,
      rating: r.overallRating
    }));

  return {
    hygiene: {
      totalRawCount,
      testRecordsRemoved,
      duplicatesMerged,
      validCleanCount,
      dataIntegrityRate
    },
    kpis: {
      averageRating,
      unawareGapsPercent,
      timeWastedOver15MinPercent,
      willingToTestPercent,
      feasibilityHighPercent
    },
    backgroundDistribution,
    painPointsRanking,
    timeWastedDistribution,
    featuresRanking,
    featuredFeedbacks,
    records: cleanedRecords
  };
}
