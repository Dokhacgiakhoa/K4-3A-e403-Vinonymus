/**
 * Helper làm sạch Markdown cho giao diện Sổ tay Notebook:
 * Loại bỏ các thẻ ảnh ![alt](url) và định dạng lại các đường link rác
 * để giao diện hiển thị gọn gàng, thuần văn bản hướng dẫn.
 */
export function stripMediaFromMarkdown(markdown: string): string {
  if (!markdown) return '';

  return markdown
    // Loại bỏ thẻ ảnh markdown ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Loại bỏ khối phần "Hình ảnh trích dẫn:" hoặc "Kênh liên hệ:" nếu chỉ chứa link/ảnh
    .replace(/### Hình ảnh trích dẫn[\s\S]*$/, '')
    // Xóa các dòng khoảng trắng thừa do loại bỏ ảnh
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
