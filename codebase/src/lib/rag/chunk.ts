export interface ChunkResult {
  headingPath: string | null;
  content: string;
  tokenCount: number;
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil((text.length / 2.5) * 1.15);
}

/** Kiểm tra xem một khối text có chứa bảng markdown hay không */
function isMarkdownTable(text: string): boolean {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return false;
  const firstLine = lines[0] ?? '';
  const secondLine = lines[1] ?? '';
  return firstLine.trim().startsWith('|') && secondLine.trim().startsWith('|') && secondLine.includes('-');
}

/** Cắt markdown thành các chunks theo heading, bảo toàn bảng markdown */
export function chunkMarkdown(
  markdown: string,
  targetSize = 800,
  overlapRatio = 0.15
): ChunkResult[] {
  if (!markdown || !markdown.trim()) {
    return [];
  }

  const lines = markdown.split('\n');
  const sections: { headingPath: string | null; content: string }[] = [];
  
  const currentHeadings: string[] = [];
  let currentContentLines: string[] = [];

  const flushSection = () => {
    if (currentContentLines.length > 0) {
      const content = currentContentLines.join('\n').trim();
      if (content) {
        sections.push({
          headingPath: currentHeadings.length > 0 ? currentHeadings.join(' > ') : null,
          content,
        });
      }
      currentContentLines = [];
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch && headingMatch[1] && headingMatch[2]) {
      flushSection();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      currentHeadings.splice(level - 1);
      currentHeadings[level - 1] = title;
    } else {
      currentContentLines.push(line);
    }
  }
  flushSection();

  const rawChunks: ChunkResult[] = [];

  for (const section of sections) {
    const tokens = estimateTokens(section.content);
    
    // Nếu vừa vặn hoặc chứa bảng markdown (bảo toàn bảng) -> giữ nguyên
    if (tokens <= targetSize || isMarkdownTable(section.content)) {
      rawChunks.push({
        headingPath: section.headingPath,
        content: section.content,
        tokenCount: tokens,
      });
      continue;
    }

    // Nếu quá dài và không phải 1 bảng đơn thuần, cắt theo paragraph
    const paragraphs = section.content.split(/\n\n+/);
    let currentChunkText = '';

    for (const p of paragraphs) {
      const combined = currentChunkText ? `${currentChunkText}\n\n${p}` : p;
      if (estimateTokens(combined) > targetSize && currentChunkText) {
        rawChunks.push({
          headingPath: section.headingPath,
          content: currentChunkText.trim(),
          tokenCount: estimateTokens(currentChunkText.trim()),
        });

        // Chồng lấn 15%
        const overlapChars = Math.floor(currentChunkText.length * overlapRatio);
        const overlapText = currentChunkText.slice(-overlapChars);
        currentChunkText = `${overlapText}\n\n${p}`;
      } else {
        currentChunkText = combined;
      }
    }

    if (currentChunkText.trim()) {
      rawChunks.push({
        headingPath: section.headingPath,
        content: currentChunkText.trim(),
        tokenCount: estimateTokens(currentChunkText.trim()),
      });
    }
  }

  // Gộp các chunk quá nhỏ (< 25% targetSize) với chunk kế tiếp nếu cùng headingPath
  const minChunkSize = Math.floor(targetSize * 0.25);
  const mergedChunks: ChunkResult[] = [];

  for (let i = 0; i < rawChunks.length; i++) {
    const current = rawChunks[i];
    if (!current) continue;

    const next = rawChunks[i + 1];

    if (
      current.tokenCount < minChunkSize &&
      next &&
      next.headingPath === current.headingPath &&
      !isMarkdownTable(current.content) &&
      !isMarkdownTable(next.content)
    ) {
      const mergedContent = `${current.content}\n\n${next.content}`;
      rawChunks[i + 1] = {
        headingPath: current.headingPath,
        content: mergedContent,
        tokenCount: estimateTokens(mergedContent),
      };
    } else {
      mergedChunks.push(current);
    }
  }

  return mergedChunks;
}
