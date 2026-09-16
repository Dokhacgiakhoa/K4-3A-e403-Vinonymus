'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Terminal, 
  Flame, 
  Layers, 
  Target, 
  Compass,
  Cpu,
  Code,
  Briefcase,
  Zap,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  GraduationCap,
  GitBranch,
  Swords,
  Trophy,
  Play,
  Crosshair,
  Brain,
  Network,
  Database,
  Server,
  Workflow,
  Rocket,
  Crown,
  ExternalLink,
  ChevronDown,
  FileCode
} from 'lucide-react';
import { clientStorage, type StoredUser } from '@/lib/client-storage';
import { CurriculumModuleItem } from '@/data/sfia-community-data';

// =========================================================================
// TYPES & DATA STRUCTURES
// =========================================================================

export type RoadmapPreset = 
  | 'NON_TECH_TO_AI_ENG'   // Non-Tech -> AI Engineer (11 chặng)
  | 'NON_TECH_TO_AI_BIZ'   // Non-Tech -> AI Business Leader (5 chặng)
  | 'DEV_TO_AI_APP'        // Dev -> AI Application Developer (7 chặng)
  | 'DATA_TO_MLOPS';       // Data -> MLOps & LLM Serving (10 chặng)

export interface SkillNode {
  id: string;
  code: string;
  title: string;
  shortName: string;
  tier: number; // 0: L0, 1: L1, 2: L2, 3: L3, 4: L4
  tierLabel: string;
  colIndex: number; // 0: Trái (16.67%), 1: Giữa (50%), 2: Phải (83.33%)
  levelTag: string;
  icon: 'brain' | 'network' | 'shield' | 'code' | 'terminal' | 'git' | 'workflow' | 'database' | 'server' | 'sparkles' | 'cpu' | 'rocket' | 'briefcase';
  category: 'BIZ' | 'APP' | 'DATA' | 'UNIVERSAL';
  categoryLabel: string;
  prerequisites: string[];
  targetRoles: string[];
  skills: string[];
  estimatedHours: number;
  xpReward: number;
  briefing: string;
}

// 18 QUẢ CẦU TRỤ CỘT TRÊN CÂY KỸ NĂNG NỐI VÀO CÁC CỤM CHUYÊN SÂU
export const CIRCULAR_SKILL_NODES: SkillNode[] = [
  // TẦNG 0: AI FOUNDATIONS (10 CHUYÊN ĐỀ TRONG CỤM)
  {
    id: 'MOD-01',
    code: 'L0.1',
    title: 'Chuyên Đề 0.1 • Bản Chất AI, Giải Mã Nỗi Sợ & Lịch Sử',
    shortName: 'Bản Chất AI',
    tier: 0,
    tierLabel: 'TẦNG 0 • KHỞI ĐIỂM VỠ LÒNG (AI FOUNDATIONS)',
    colIndex: 0,
    levelTag: 'Level 0 • Foundation',
    icon: 'brain',
    category: 'UNIVERSAL',
    categoryLabel: 'Nền Tảng Chung',
    prerequisites: [],
    targetRoles: ['Mọi Đối Tượng', 'Non-Tech'],
    skills: ['Tư duy AI-First', 'Phân loại AI hẹp vs AGI', 'Giải mã nỗi sợ thay thế'],
    estimatedHours: 5,
    xpReward: 150,
    briefing: 'Xóa bỏ hoàn toàn định kiến và nỗi sợ về AI. Khám phá lịch sử phát triển từ mạng Neuron đầu tiên đến kỷ nguyên GenAI, xây dựng nền tảng tư duy khai phóng để làm chủ công cụ.'
  },
  {
    id: 'MOD-03',
    code: 'L0.3',
    title: 'Chuyên Đề 0.3 • Vòng Đời Dữ Liệu & Đột Phá Transformer',
    shortName: 'Attention Is All You Need',
    tier: 0,
    tierLabel: 'TẦNG 0 • KHỞI ĐIỂM VỠ LÒNG (AI FOUNDATIONS)',
    colIndex: 1,
    levelTag: 'Level 0 • Foundation',
    icon: 'network',
    category: 'UNIVERSAL',
    categoryLabel: 'Nền Tảng Chung',
    prerequisites: ['MOD-01'],
    targetRoles: ['Mọi Đối Tượng', 'Khởi Đầu Kỹ Thuật'],
    skills: ['Vòng đời dữ liệu', 'Học máy cơ bản', 'Đột phá kiến trúc Attention'],
    estimatedHours: 6,
    xpReward: 180,
    briefing: 'Hiểu rõ bản chất dữ liệu là dầu mỏ của AI. Khám phá bài báo lịch sử Attention Is All You Need và cách cơ chế Self-Attention thay đổi toàn bộ bức tranh điện toán nhân loại.'
  },
  {
    id: 'MOD-06',
    code: 'L0.6',
    title: 'Chuyên Đề 0.6 • Đạo Đức AI & Giáo Dục 5.0 Human-Centered',
    shortName: 'Đạo Đức Số 5.0',
    tier: 0,
    tierLabel: 'TẦNG 0 • KHỞI ĐIỂM VỠ LÒNG (AI FOUNDATIONS)',
    colIndex: 2,
    levelTag: 'Level 0 • Foundation',
    icon: 'shield',
    category: 'UNIVERSAL',
    categoryLabel: 'Nền Tảng Chung',
    prerequisites: ['MOD-01'],
    targetRoles: ['Quản Lý', 'Nhà Đào Tạo', 'Công Dân Số'],
    skills: ['Trách nhiệm công dân số', 'Nhận diện Deepfake & Bias', 'Nguyên tắc THINK'],
    estimatedHours: 4,
    xpReward: 120,
    briefing: 'Học cách nhận diện và phòng vệ trước Deepfake, ảo giác AI (Hallucination), thành kiến dữ liệu và thực hành chuẩn mực đạo đức số lấy con người làm trọng tâm.'
  },

  // TẦNG 1: SFIA LEVEL 1 (FOLLOW - 12 CHUYÊN ĐỀ TRONG CỤM)
  {
    id: 'MOD-1',
    code: 'SFIA-1',
    title: 'Module 01 • Tokenizer BPE & Môi Trường Python Thực Chiến',
    shortName: 'Tokenizer BPE',
    tier: 1,
    tierLabel: 'TẦNG 1 • TIẾP THU KỸ THUẬT (SFIA L1 - FOLLOW)',
    colIndex: 0,
    levelTag: 'SFIA L1 • Follow',
    icon: 'code',
    category: 'APP',
    categoryLabel: 'AI Application',
    prerequisites: ['MOD-03'],
    targetRoles: ['Software Dev', 'AI Engineer', 'Junior Dev'],
    skills: ['Python venv/uv', 'Byte-Pair Encoding', 'Xử lý nở Token Tiếng Việt'],
    estimatedHours: 20,
    xpReward: 400,
    briefing: 'Thâm nhập tầng nền tảng của LLM: Cách Tokenizer phân tách ký tự, hiện tượng nở token tiếng Việt gây tốn kém chi phí và cách cấu hình môi trường Python cô lập chuẩn kỹ nghệ.'
  },
  {
    id: 'MOD-2',
    code: 'SFIA-2',
    title: 'Module 02 • Logic Python & Lập Trình Gọi LLM API An Toàn',
    shortName: 'Python & LLM API',
    tier: 1,
    tierLabel: 'TẦNG 1 • TIẾP THU KỸ THUẬT (SFIA L1 - FOLLOW)',
    colIndex: 1,
    levelTag: 'SFIA L1 • Follow',
    icon: 'terminal',
    category: 'APP',
    categoryLabel: 'AI Application',
    prerequisites: ['MOD-1'],
    targetRoles: ['Software Dev', 'AI Application'],
    skills: ['Cấu trúc If/For/Def', 'Gọi API OpenAI / Gemini', 'Bảo mật .env chống lộ key'],
    estimatedHours: 20,
    xpReward: 450,
    briefing: 'Xây dựng script Python giao tiếp đa nhà cung cấp LLM, xử lý retry exponential backoff khi rate limit và thiết lập cơ chế bảo mật zero-leakage cho API Key.'
  },
  {
    id: 'MOD-3',
    code: 'SFIA-3',
    title: 'Module 03 • Quản Lý Bộ Nhớ, Array & Git Collaboration',
    shortName: 'Git Ops & RAM',
    tier: 1,
    tierLabel: 'TẦNG 1 • TIẾP THU KỸ THUẬT (SFIA L1 - FOLLOW)',
    colIndex: 2,
    levelTag: 'SFIA L1 • Follow',
    icon: 'git',
    category: 'APP',
    categoryLabel: 'AI Application',
    prerequisites: ['MOD-1'],
    targetRoles: ['Software Dev', 'Fullstack'],
    skills: ['Git Branching / PR', 'Quản lý RAM Python vs Java', 'Clean Code nguyên bản'],
    estimatedHours: 20,
    xpReward: 450,
    briefing: 'Làm chủ cơ chế cấp phát bộ nhớ RAM, cấu trúc dữ liệu mảng liên tục cho tính toán tensor và quy trình phối hợp nhóm Git PR chuẩn chuyên nghiệp.'
  },

  // TẦNG 2: SFIA LEVEL 2 (ASSIST - 15 CHUYÊN ĐỀ TRONG CỤM)
  {
    id: 'MOD-4',
    code: 'SFIA-4',
    title: 'Module 04 • Pydantic Schema & Tự Động Hóa Workflow n8n',
    shortName: 'n8n & Pydantic',
    tier: 2,
    tierLabel: 'TẦNG 2 • CẤU TRÚC & TÍCH HỢP (SFIA L2 - ASSIST)',
    colIndex: 0,
    levelTag: 'SFIA L2 • Assist',
    icon: 'workflow',
    category: 'BIZ',
    categoryLabel: 'AI Business & Product',
    prerequisites: ['MOD-2'],
    targetRoles: ['Product Manager', 'AI Business', 'No-Code Developer'],
    skills: ['Pydantic Data Models', 'JSON Type-Safe', 'Tự động hóa Webhook/n8n'],
    estimatedHours: 20,
    xpReward: 500,
    briefing: 'Làm chủ tự động hóa quy trình nghiệp vụ với n8n kết hợp Pydantic để chuẩn hóa dữ liệu đầu ra từ LLM, biến ý tưởng sản phẩm thành luồng vận hành tự động không độ trễ.'
  },
  {
    id: 'MOD-5',
    code: 'SFIA-5',
    title: 'Module 05 • Clean WebAPI & Vector Embeddings Qdrant',
    shortName: 'WebAPI & Vectors',
    tier: 2,
    tierLabel: 'TẦNG 2 • CẤU TRÚC & TÍCH HỢP (SFIA L2 - ASSIST)',
    colIndex: 1,
    levelTag: 'SFIA L2 • Assist',
    icon: 'database',
    category: 'DATA',
    categoryLabel: 'AI Infra & Data',
    prerequisites: ['MOD-2'],
    targetRoles: ['Backend Dev', 'AI Engineer'],
    skills: ['FastAPI / C# .NET WebAPI', 'Cosine Similarity', 'Vector Embeddings'],
    estimatedHours: 25,
    xpReward: 550,
    briefing: 'Xây dựng kiến trúc WebAPI sạch kết nối trực tiếp với cơ sở dữ liệu vector Qdrant triệu chiều, tính toán khoảng cách Cosine và xử lý tải cao bền vững.'
  },
  {
    id: 'MOD-6',
    code: 'SFIA-6',
    title: 'Module 06 • Thuật Toán HNSW Indexing & Metric Spaces',
    shortName: 'HNSW Indexing',
    tier: 2,
    tierLabel: 'TẦNG 2 • CẤU TRÚC & TÍCH HỢP (SFIA L2 - ASSIST)',
    colIndex: 2,
    levelTag: 'SFIA L2 • Assist',
    icon: 'server',
    category: 'DATA',
    categoryLabel: 'AI Infra & Data',
    prerequisites: ['MOD-5'],
    targetRoles: ['AI Data Engineer', 'MLOps'],
    skills: ['Thuật toán đồ thị HNSW', 'Không gian đa chiều', 'Qdrant Collection Index'],
    estimatedHours: 25,
    xpReward: 600,
    briefing: 'Đi sâu vào cấu trúc toán học của Hierarchical Navigable Small World (HNSW), tối ưu hóa thời gian tìm kiếm láng giềng gần nhất (ANN) từ hàng triệu điểm dữ liệu về mức miligiây.'
  },

  // TẦNG 3: SFIA LEVEL 3 (APPLY - 15 CHUYÊN ĐỀ TRONG CỤM)
  {
    id: 'MOD-7',
    code: 'SFIA-7',
    title: 'Module 07 • Semantic Chunking & Embedding BGE-M3',
    shortName: 'Chunking & BGE-M3',
    tier: 3,
    tierLabel: 'TẦNG 3 • GIẢI PHÁP THỰC CHIẾN (SFIA L3 - APPLY)',
    colIndex: 0,
    levelTag: 'SFIA L3 • Apply',
    icon: 'sparkles',
    category: 'APP',
    categoryLabel: 'AI Application',
    prerequisites: ['MOD-5'],
    targetRoles: ['Enterprise RAG', 'AI Engineer'],
    skills: ['Phân tách văn bản ngữ nghĩa', 'Mô hình đa ngôn ngữ BGE-M3', 'Cohere Reranking'],
    estimatedHours: 30,
    xpReward: 750,
    briefing: 'Triển khai kỹ thuật cắt lát tài liệu thông minh theo cấu trúc ngữ nghĩa, ứng dụng embedding đa ngôn ngữ vượt trội BGE-M3 và lớp tái xếp hạng Cohere Rerank để triệt tiêu ảo giác.'
  },
  {
    id: 'MOD-8',
    code: 'SFIA-8',
    title: 'Module 08 • Hybrid Search RRF & SQL Database Agent',
    shortName: 'Hybrid RAG & SQL',
    tier: 3,
    tierLabel: 'TẦNG 3 • GIẢI PHÁP THỰC CHIẾN (SFIA L3 - APPLY)',
    colIndex: 1,
    levelTag: 'SFIA L3 • Apply',
    icon: 'code',
    category: 'APP',
    categoryLabel: 'AI Application',
    prerequisites: ['MOD-7'],
    targetRoles: ['Fullstack AI', 'AI Application'],
    skills: ['Reciprocal Rank Fusion (RRF)', 'Function Calling Tools', 'Tác nhân tra cứu SQL'],
    estimatedHours: 30,
    xpReward: 800,
    briefing: 'Kết hợp sức mạnh giữa Dense Vector và Thống kê BM25 qua thuật toán RRF. Xây dựng Database Agent có khả năng tự sinh và truy vấn SQL an toàn với kiểm soát tham số nghiêm ngặt.'
  },
  {
    id: 'MOD-9',
    code: 'SFIA-9',
    title: 'Module 09 • Kỹ Thuật Fine-Tuning LoRA / QLoRA',
    shortName: 'Fine-Tuning LoRA',
    tier: 3,
    tierLabel: 'TẦNG 3 • GIẢI PHÁP THỰC CHIẾN (SFIA L3 - APPLY)',
    colIndex: 2,
    levelTag: 'SFIA L3 • Apply',
    icon: 'cpu',
    category: 'DATA',
    categoryLabel: 'AI Infra & Data',
    prerequisites: ['MOD-5'],
    targetRoles: ['AI Engineer', 'MLOps'],
    skills: ['Low-Rank Adaptation (LoRA)', 'Lượng tử hóa 4-bit QLoRA', 'Chuẩn bị dataset'],
    estimatedHours: 35,
    xpReward: 850,
    briefing: 'Tự tay huấn luyện thích ứng mô hình ngôn ngữ mã nguồn mở bằng LoRA và QLoRA trên GPU đơn lẻ, nắm vững phương pháp chuẩn bị dữ liệu và đánh giá hội tụ loss.'
  },

  // TẦNG 4: SFIA LEVEL 4 (ENABLE - 15 CHUYÊN ĐỀ TRONG CỤM)
  {
    id: 'MOD-10',
    code: 'SFIA-10',
    title: 'Module 10 • Hệ Thống Multi-Agent LangGraph State Machine',
    shortName: 'Multi-Agent Graph',
    tier: 4,
    tierLabel: 'TẦNG 4 • KIẾN TRÚC SƯ HỆ THỐNG (SFIA L4 - ENABLE)',
    colIndex: 0,
    levelTag: 'SFIA L4 • Enable',
    icon: 'network',
    category: 'APP',
    categoryLabel: 'AI Application',
    prerequisites: ['MOD-8'],
    targetRoles: ['AI Architect', 'Lead AI Engineer'],
    skills: ['LangGraph State Machine', 'Human-in-the-loop', 'Multi-Agent Orchestration'],
    estimatedHours: 35,
    xpReward: 1000,
    briefing: 'Kiến tạo mạng lưới đa tác nhân tự hành phối hợp giải quyết bài toán phức tạp bằng LangGraph, hỗ trợ checkpoint phục hồi trạng thái và can thiệp phê duyệt của con người (Human-in-the-loop).'
  },
  {
    id: 'MOD-11',
    code: 'SFIA-11',
    title: 'Module 11 • Distributed Serving vLLM & PagedAttention',
    shortName: 'vLLM Serving',
    tier: 4,
    tierLabel: 'TẦNG 4 • KIẾN TRÚC SƯ HỆ THỐNG (SFIA L4 - ENABLE)',
    colIndex: 1,
    levelTag: 'SFIA L4 • Enable',
    icon: 'rocket',
    category: 'DATA',
    categoryLabel: 'AI Infra & Data',
    prerequisites: ['MOD-9', 'MOD-10'],
    targetRoles: ['MLOps Engineer', 'Infrastructure Architect'],
    skills: ['vLLM Distributed Serving', 'PagedAttention KV Cache', 'Continuous Batching'],
    estimatedHours: 40,
    xpReward: 1200,
    briefing: 'Triển khai cụm phục vụ suy luận LLM phân tán quy mô lớn với vLLM, ứng dụng cơ chế cấp phát bộ nhớ ảo PagedAttention giúp tăng thông lượng xử lý gấp 10-20 lần.'
  },
  {
    id: 'MOD-12',
    code: 'SFIA-12',
    title: 'Module 12 • Đánh Giá Ragas Triad & Quản Trị ISO 42001',
    shortName: 'Ragas & ISO 42001',
    tier: 4,
    tierLabel: 'TẦNG 4 • KIẾN TRÚC SƯ HỆ THỐNG (SFIA L4 - ENABLE)',
    colIndex: 2,
    levelTag: 'SFIA L4 • Enable',
    icon: 'briefcase',
    category: 'BIZ',
    categoryLabel: 'AI Business & Product',
    prerequisites: ['MOD-4'],
    targetRoles: ['AI Product Director', 'Compliance Lead', 'Enterprise Architect'],
    skills: ['Ragas Triad Evaluation', 'Sơ đồ C4 Model', 'Tiêu chuẩn quốc tế ISO 42001'],
    estimatedHours: 35,
    xpReward: 1000,
    briefing: 'Thiết lập khung đánh giá định lượng cho AI bằng Ragas Triad (Faithfulness, Answer Relevance, Context Recall) và áp dụng tiêu chuẩn bảo mật quản trị AI toàn cầu ISO/IEC 42001.'
  }
];

const DEFAULT_NODE: SkillNode = CIRCULAR_SKILL_NODES[0]!;

// CÁC LỘ TRÌNH ĐỘC BẢN CHUẨN KỸ NGHỆ
export const ROADMAP_PRESETS: Record<RoadmapPreset, { title: string; subtitle: string; path: string[] }> = {
  NON_TECH_TO_AI_ENG: {
    title: 'Từ Non-Tech ➔ AI Engineer Toàn Diện',
    subtitle: 'Lộ trình 11 chặng thực chiến từ vỡ lòng đến Kiến trúc sư Multi-Agent & vLLM Serving',
    path: [
      'MOD-01', 'MOD-03', 'MOD-1', 'MOD-2', 'MOD-4', 
      'MOD-5', 'MOD-7', 'MOD-8', 'MOD-9', 'MOD-10', 'MOD-11'
    ]
  },
  NON_TECH_TO_AI_BIZ: {
    title: 'Từ Non-Tech ➔ AI Business & Product Leader',
    subtitle: 'Lộ trình 5 chặng tập trung Tự động hóa quy trình, Quản trị rủi ro & Tiêu chuẩn ISO 42001',
    path: [
      'MOD-01', 'MOD-03', 'MOD-06', 'MOD-4', 'MOD-12'
    ]
  },
  DEV_TO_AI_APP: {
    title: 'Kỹ Sư Phần Mềm ➔ AI Application Developer',
    subtitle: 'Lộ trình 7 chặng tích hợp RAG, SQL Agent & Hệ thống Multi-Agent vào sản phẩm Web/App',
    path: [
      'MOD-1', 'MOD-2', 'MOD-4', 'MOD-5', 'MOD-7', 'MOD-8', 'MOD-10'
    ]
  },
  DATA_TO_MLOPS: {
    title: 'Chuyên Viên Dữ Liệu ➔ MLOps & LLM Systems',
    subtitle: 'Lộ trình 8 chặng tối ưu Indexing HNSW, Fine-Tuning LoRA & Distributed Serving vLLM',
    path: [
      'MOD-03', 'MOD-1', 'MOD-5', 'MOD-6', 'MOD-7', 'MOD-9', 'MOD-10', 'MOD-11'
    ]
  }
};

function renderNodeIcon(iconType: SkillNode['icon'], className: string) {
  switch (iconType) {
    case 'brain': return <Brain className={className} />;
    case 'network': return <Network className={className} />;
    case 'shield': return <ShieldCheck className={className} />;
    case 'code': return <Code className={className} />;
    case 'terminal': return <Terminal className={className} />;
    case 'git': return <GitBranch className={className} />;
    case 'workflow': return <Workflow className={className} />;
    case 'database': return <Database className={className} />;
    case 'server': return <Server className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'cpu': return <Cpu className={className} />;
    case 'rocket': return <Rocket className={className} />;
    case 'briefcase': return <Briefcase className={className} />;
    default: return <Zap className={className} />;
  }
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================

interface GamifiedSkillTreeViewProps {
  currentUser: StoredUser | null;
  enrolledCourses: string[];
  allModules?: CurriculumModuleItem[];
  onSelectModuleForDetail?: (moduleId: string) => void;
}

export function GamifiedSkillTreeView({
  currentUser,
  enrolledCourses,
  allModules = [],
  onSelectModuleForDetail
}: GamifiedSkillTreeViewProps) {
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapPreset>('NON_TECH_TO_AI_ENG');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('MOD-01');

  const activePreset = ROADMAP_PRESETS[activeRoadmap];
  const activePathIds = activePreset.path;

  // Node đang chọn
  const selectedNode: SkillNode = useMemo(() => {
    return CIRCULAR_SKILL_NODES.find(n => n.id === selectedNodeId) ?? DEFAULT_NODE;
  }, [selectedNodeId]);

  // Thông tin đầy đủ của module trong allModules (bao gồm topics, assignment...)
  const selectedModuleFull = useMemo(() => {
    return allModules.find(m => m.id.trim().toLowerCase() === selectedNode.id.trim().toLowerCase());
  }, [allModules, selectedNode.id]);

  // Tìm các môn cùng Tầng trong cụm kỹ năng lớn (Cluster Micro-Courses)
  const clusterTierModules = useMemo(() => {
    const tierPrefix = selectedNode.tier === 0 ? 'L0' : `L${selectedNode.tier}`;
    return allModules.filter(m => m.levelCode === tierPrefix && m.id.toLowerCase() !== selectedNode.id.toLowerCase());
  }, [allModules, selectedNode.tier, selectedNode.id]);

  const currentStepIndex = useMemo(() => {
    const idx = activePathIds.indexOf(selectedNode.id);
    return idx >= 0 ? idx + 1 : null;
  }, [activePathIds, selectedNode.id]);

  // 5 Tầng Nodes
  const tiers = useMemo(() => {
    return [0, 1, 2, 3, 4].map(tierIndex => {
      const nodesInTier = CIRCULAR_SKILL_NODES.filter(n => n.tier === tierIndex).sort((a, b) => a.colIndex - b.colIndex);
      return {
        tierIndex,
        label: nodesInTier[0]?.tierLabel ?? `TẦNG ${tierIndex}`,
        nodes: nodesInTier
      };
    });
  }, []);

  const handleNextStep = () => {
    if (currentStepIndex && currentStepIndex < activePathIds.length) {
      const nextId = activePathIds[currentStepIndex];
      if (nextId) setSelectedNodeId(nextId);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex && currentStepIndex > 1) {
      const prevId = activePathIds[currentStepIndex - 2];
      if (prevId) setSelectedNodeId(prevId);
    }
  };

  const isSelectedEnrolled = currentUser ? enrolledCourses.some(id => id.trim().toLowerCase() === selectedNode.id.trim().toLowerCase()) : false;
  const { isCompleted: isSelectedCompleted } = clientStorage.getCourseProgress(selectedNode.id, 3);
  const isSelectedPrereqMet = selectedNode.prerequisites.length === 0 || selectedNode.prerequisites.every(prereqId => {
    const progress = clientStorage.getCourseProgress(prereqId, 3);
    return progress.isCompleted || enrolledCourses.includes(prereqId);
  });

  return (
    <div className="space-y-6 animate-fadeIn font-sans">

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & METRICS BAR: BÁCH KHOA TOÀN THƯ 67 KHÓA HỌC & 150+ LABS   */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#080f24]/90 border border-sky-500/35 p-5 sm:p-6 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span>K.AI Labs Skill Graph Engine</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Chuẩn SFIA (v8) & Bloom's Taxonomy
                </span>
                {currentUser && currentUser.tier !== 'Pro' && currentUser.plan !== 'pro' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    📌 Roadmap Chuẩn Tổng Quan (Chưa Cá Nhân Hóa)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {activePreset.title}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl font-normal">
                {activePreset.subtitle}
              </p>
            </div>

            {/* Total Ecosystem Metrics */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="px-3 py-2 rounded-2xl bg-[#0b1329]/90 border border-sky-500/30 text-center backdrop-blur-md shadow-md">
                <div className="text-base sm:text-lg font-bold text-sky-400 font-mono">67 Chuyên Đề</div>
                <div className="text-[10px] text-slate-400 font-medium">Toàn Hệ Sinh Thái</div>
              </div>

              <div className="px-3 py-2 rounded-2xl bg-[#0b1329]/90 border border-emerald-500/30 text-center backdrop-blur-md shadow-md">
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">150+ Đề Lab</div>
                <div className="text-[10px] text-slate-400 font-medium">Kèm Script Test</div>
              </div>

              <div className="px-3 py-2 rounded-2xl bg-[#0b1329]/90 border border-amber-500/30 text-center backdrop-blur-md shadow-md">
                <div className="text-base sm:text-lg font-bold text-amber-400 font-mono">~1,850h</div>
                <div className="text-[10px] text-slate-400 font-medium">Giờ Thực Học</div>
              </div>
            </div>
          </div>

          {/* 4 Preset Roadmap Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
            {[
              { key: 'NON_TECH_TO_AI_ENG', label: '⚡ Non-Tech ➔ AI Engineer', desc: '11 Chặng trọng tâm xuyên suốt L0 ➔ L4', badge: 'Khuyên Dùng' },
              { key: 'NON_TECH_TO_AI_BIZ', label: '💼 Non-Tech ➔ AI Business', desc: '5 Chặng: n8n, SP & ISO 42001', badge: 'Product' },
              { key: 'DEV_TO_AI_APP', label: '💻 Kỹ Sư Dev ➔ AI App Dev', desc: '7 Chặng: RAG, WebAPI & Agent', badge: 'Fast Track' },
              { key: 'DATA_TO_MLOPS', label: '🔬 Data Analyst ➔ MLOps', desc: '8 Chặng: VectorDB & vLLM Serving', badge: 'Data' },
            ].map((preset) => {
              const isCurrent = activeRoadmap === preset.key;
              return (
                <button
                  key={preset.key}
                  onClick={() => {
                    setActiveRoadmap(preset.key as RoadmapPreset);
                    const newPath = ROADMAP_PRESETS[preset.key as RoadmapPreset].path;
                    if (newPath[0]) setSelectedNodeId(newPath[0]);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-400 shadow-md shadow-sky-500/25'
                      : 'bg-[#0b1329]/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{preset.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isCurrent ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 line-clamp-1">{preset.desc}</div>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SPLIT-SCREEN LAYOUT: BÊN TRÁI LÀ CÂY KỸ NĂNG, BÊN PHẢI LÀ QUEST HUD   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================= */}
        {/* 2A. CỘT TRÁI: CÂY KỸ NĂNG VỚI CÁC QUẢ CẦU VÀ MẠCH NĂNG LƯỢNG (lg:col-span-7) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          
          <div className="rounded-3xl bg-[#080f24]/95 border border-sky-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
            
            {/* Nền phẳng mượt mà êm mắt, loại bỏ lưới chấm gây rối thị giác */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Đồ Thị Phân Nhánh: <strong className="text-white">Gốc Nền Tảng ➔ 3 Trục Chuyên Môn Độc Lập ➔ Đỉnh Cao L4</strong></span>
              </div>
              <span className="hidden sm:inline text-sky-400">Chọn quả cầu kỹ năng để nạp chi tiết ➔</span>
            </div>

            {/* 3 Column Track Labels */}
            <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 justify-items-center text-center py-2 px-1 bg-slate-900/60 rounded-xl border border-slate-800/80 my-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 font-mono">
                <span>💼 Nhánh AI Product & Biz</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300 font-mono">
                <span>💻 Nhánh AI App & Agent</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300 font-mono">
                <span>🔬 Nhánh Data & MLOps</span>
              </div>
            </div>

            {/* 5 Tiers of Circular Nodes with Vertical & Branching Conduits */}
            <div className="relative z-10 py-2 space-y-6">
              
              {tiers.map((tier, tierIdx) => {
                return (
                  <div key={tier.tierIndex} className="relative space-y-3">
                    
                    {/* Header Label */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${
                          tier.tierIndex === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          tier.tierIndex === 1 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                          tier.tierIndex === 2 ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' :
                          tier.tierIndex === 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {tier.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {tier.tierIndex === 0 ? '10 Chuyên Đề Gốc' : tier.tierIndex === 1 ? '12 Chuyên Đề Cụm' : tier.tierIndex === 4 ? 'Đỉnh Cao Hội Tụ L4' : '15 Chuyên Đề Cụm'}
                      </span>
                    </div>

                    {/* Vertical Branching Conduits & Circular Orbs */}
                    <div className="relative py-2">


                      {/* 3 Circular Sockets */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 justify-items-center relative z-10">
                        {tier.nodes.map((node) => {
                          const isSelected = selectedNode.id === node.id;
                          const stepNumber = activePathIds.indexOf(node.id) + 1;
                          const isInActivePath = stepNumber > 0;
                          const { isCompleted } = clientStorage.getCourseProgress(node.id, 3);

                          const branchBorder = 
                            node.category === 'BIZ' ? 'border-amber-400 text-amber-300' :
                            node.category === 'APP' ? 'border-sky-400 text-sky-300' :
                            node.category === 'DATA' ? 'border-teal-400 text-teal-300' :
                            'border-emerald-400 text-emerald-300';

                          return (
                            <div key={node.id} className="flex flex-col items-center group relative">
                              
                              <button
                                type="button"
                                onClick={() => setSelectedNodeId(node.id)}
                                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                  isSelected
                                    ? 'ring-4 ring-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.7)] scale-110 bg-[#0c1f3d] z-30'
                                    : isCompleted
                                      ? 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-emerald-950/70 hover:scale-105'
                                      : isInActivePath
                                        ? 'ring-2 ring-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.45)] bg-slate-900/90 hover:scale-105'
                                        : 'border border-slate-700/80 bg-slate-900/50 opacity-60 hover:opacity-100 hover:border-slate-500'
                                }`}
                              >
                                
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border ${branchBorder} ${
                                  isSelected ? 'bg-sky-500/20' : isInActivePath ? 'bg-amber-500/10' : 'bg-slate-950/60'
                                }`}>
                                  {renderNodeIcon(
                                    node.icon, 
                                    `w-6 h-6 sm:w-7 sm:h-7 ${
                                      isSelected ? 'text-sky-300' : 
                                      isCompleted ? 'text-emerald-400' : 
                                      isInActivePath ? 'text-amber-300' : 'text-slate-400'
                                    }`
                                  )}
                                </div>

                                {isInActivePath && (
                                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-mono font-black text-xs flex items-center justify-center shadow-lg ring-2 ring-slate-950 animate-bounce" style={{ animationDuration: '3s' }}>
                                    {stepNumber}
                                  </div>
                                )}

                                {isCompleted && !isInActivePath && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                )}

                              </button>

                              <div className="mt-2 text-center space-y-0.5 max-w-[100px]">
                                <div className="flex items-center justify-center gap-1">
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                    isSelected ? 'bg-sky-500 text-slate-950' :
                                    isInActivePath ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                    'bg-slate-800 text-slate-400'
                                  }`}>
                                    {node.code}
                                  </span>
                                </div>

                                <div className="text-[11px] font-bold text-white group-hover:text-sky-300 transition leading-tight line-clamp-1">
                                  {node.shortName}
                                </div>

                                <div className="text-[9px] font-mono text-slate-400">
                                  ~{node.estimatedHours}h
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* SVG Inter-Tier Energy Cables */}
                    {tierIdx < 4 && (
                      <div className="relative h-10 sm:h-12 w-full flex items-center justify-center pointer-events-none">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                          {/* Đường trục dẫn tĩnh chìm thanh mảnh, không gây rối thị giác */}
                          <line x1="16.67" y1="0" x2="16.67" y2="40" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" />
                          <line x1="50" y1="0" x2="50" y2="40" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" />
                          <line x1="83.33" y1="0" x2="83.33" y2="40" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.3" vectorEffect="non-scaling-stroke" />

                          {tierIdx === 0 && activeRoadmap === 'NON_TECH_TO_AI_ENG' && (
                            <>
                              <path d="M 50 0 C 50 25, 16.67 15, 16.67 40" stroke="#f59e0b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" fill="none" />
                              <path d="M 50 0 C 50 25, 16.67 15, 16.67 40" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" fill="none" className="animate-pulse" />
                            </>
                          )}

                          {tierIdx === 1 && activeRoadmap === 'NON_TECH_TO_AI_ENG' && (
                            <>
                              <path d="M 50 0 C 50 25, 16.67 15, 16.67 40" stroke="#f59e0b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" fill="none" />
                              <path d="M 50 0 C 50 25, 16.67 15, 16.67 40" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" fill="none" className="animate-pulse" />
                            </>
                          )}

                          {tierIdx === 2 && activeRoadmap === 'NON_TECH_TO_AI_ENG' && (
                            <>
                              <path d="M 50 0 C 50 25, 16.67 15, 16.67 40" stroke="#f59e0b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" fill="none" />
                              <path d="M 50 0 C 50 25, 16.67 15, 16.67 40" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" fill="none" className="animate-pulse" />
                            </>
                          )}

                          {tierIdx === 3 && activeRoadmap === 'NON_TECH_TO_AI_ENG' && (
                            <>
                              <path d="M 83.33 0 C 83.33 30, 16.67 10, 16.67 40" stroke="#f59e0b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" fill="none" />
                              <path d="M 83.33 0 C 83.33 30, 16.67 10, 16.67 40" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" fill="none" className="animate-pulse" />
                            </>
                          )}
                        </svg>
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* 2B. CỘT PHẢI: QUEST COCKPIT HUD (BÀI HỌC, LABS & PHỄU PRO VIP)           */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-6 space-y-4">
          
          <div className="rounded-3xl bg-[#080f24]/95 border border-sky-500/40 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-5 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Quest HUD Title & Tag */}
            <div className="relative z-10 space-y-2 border-b border-slate-800/80 pb-4">
              
              {currentStepIndex ? (
                <div className="flex items-center justify-between bg-amber-500/15 border border-amber-500/35 p-2 rounded-xl text-xs font-mono">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>CHẶNG {currentStepIndex} / {activePathIds.length} TRÊN LỘ TRÌNH</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex <= 1}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200"
                      title="Chặng trước"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={currentStepIndex >= activePathIds.length}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200"
                      title="Chặng tiếp theo"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-slate-400">
                  Chuyên đề bổ trợ trong Cụm Tầng {selectedNode.tier}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    {selectedNode.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {selectedNode.levelTag}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>+{selectedNode.xpReward} XP</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {selectedNode.title}
              </h3>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Nhánh: <strong className="text-sky-300 font-semibold">{selectedNode.categoryLabel}</strong></span>
                <span>•</span>
                <span>Thời lượng: ~{selectedNode.estimatedHours} giờ</span>
              </div>
            </div>

            {/* PHỄU CHUYỂN ĐỔI PRO VIP: MỜI DÙNG AI MENTOR 1-ON-1 */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0b1b36]/90 to-emerald-950/40 border border-amber-500/40 space-y-2 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wide font-mono">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>AI Mentor 1-on-1 Cá Nhân Hóa</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  Pro VIP
                </span>
              </div>
              
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                Kho giáo trình có đến <strong>67 Chuyên đề & 150+ Đề Lab</strong>. Bạn không cần học hết tất cả! Kích hoạt <strong>AI Mentor 1-on-1</strong> để chẩn đoán năng lực và rút gọn thành <strong>Lộ Trình 4 Sprints độc bản (12-16 môn trọng tâm nhất)</strong> phù hợp 100% mục tiêu của bạn.
              </p>

              <Link
                href="/learning?mode=ai_roadmap"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chẩn Đoán Năng Lực & Tạo Lộ Trình 4 Sprints</span>
              </Link>
            </div>

            {/* DANH SÁCH BÀI HỌC LÝ THUYẾT (TOPICS SYLLABUS) */}
            {selectedModuleFull?.topics && selectedModuleFull.topics.length > 0 && (
              <div className="relative z-10 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Mục Lục Bài Học ({selectedModuleFull.topics.length} Bài):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Lý thuyết kiến trúc</span>
                </div>
                
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedModuleFull.topics.map((topic, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-2 rounded-xl bg-[#0b1329]/80 border border-slate-800/90 text-xs space-y-0.5"
                    >
                      <div className="font-semibold text-white flex items-start gap-1.5">
                        <span className="text-sky-400 font-mono text-[10px] shrink-0 mt-0.5">#{tIdx + 1}</span>
                        <span>{topic.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug line-clamp-2 pl-4">
                        {topic.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ĐỀ LAB THỰC CHIẾN (ASSIGNMENT & LABS) */}
            <div className="relative z-10 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đề Lab Thực Chiến & Kịch Bản Chấm:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">100% Hands-on</span>
              </div>

              {selectedModuleFull?.assignment ? (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedModuleFull.assignment.title}</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      {selectedModuleFull.assignment.durationMinutes} phút
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedModuleFull.assignment.summary}
                  </p>

                  {selectedModuleFull.assignment.commandSnippet && (
                    <div className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-emerald-400 overflow-x-auto border border-slate-800">
                      <code>$ {selectedModuleFull.assignment.commandSnippet.code}</code>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                    <span>Sản phẩm nghiệm thu: {selectedModuleFull.assignment.deliverables.length} Deliverables</span>
                    <span className="text-emerald-400 font-bold">Kèm Test Script</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Bài Tập Thực Nghiệm Độc Lập</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bao gồm 3 bài tập code mẫu chạy trực tiếp trên Google Colab / Notebook kèm kịch bản kiểm tra thuật toán.
                  </p>
                </div>
              )}
            </div>

            {/* CÁC CHUYÊN ĐỀ CÙNG TẦNG TRONG CỤM (CLUSTER MICRO-COURSES) */}
            {clusterTierModules.length > 0 && (
              <div className="relative z-10 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Các Khóa Học Cùng Tầng ({clusterTierModules.length} Môn Khác):</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {clusterTierModules.slice(0, 6).map((m) => (
                    <Link
                      key={m.id}
                      href={`/learning/${m.id}`}
                      className="px-2.5 py-1 rounded-lg bg-[#0b1329]/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-[11px] text-slate-300 hover:text-white transition flex items-center gap-1"
                    >
                      <span className="text-sky-400 font-mono font-bold">{m.id}</span>
                      <span className="truncate max-w-[120px]">{m.title.split('•')[1] ?? m.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* HERO ACTION BUTTONS */}
            <div className="relative z-10 pt-3 border-t border-slate-800/80 space-y-2">
              <Link
                href={`/learning/${selectedNode.id}`}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 hover:from-sky-400 hover:via-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Swords className="w-4 h-4 text-slate-950" />
                <span>VÀO PHÒNG HỌC & LÀM LAB NGAY (0đ)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>

              {currentStepIndex && currentStepIndex < activePathIds.length && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/30 transition"
                >
                  <span>Chuyển Sang Chặng Tiếp Theo ({currentStepIndex + 1}/{activePathIds.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onSelectModuleForDetail && (
                <button
                  type="button"
                  onClick={() => onSelectModuleForDetail(selectedNode.id)}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-800 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tra Cứu Trong Danh Mục Toàn Bộ 67 Khóa Học</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
