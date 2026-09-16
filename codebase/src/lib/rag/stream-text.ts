const COMPLETE_IMAGE_TAG = /!\[[^\]]*\]\([^)]*\)/g;

/** Đuôi buffer có thể là phần đầu dang dở của một thẻ ảnh `![alt](url)` bị cắt ngang giữa 2 chunk:
 *  `!` · `![` · `![alt` · `![alt]` · `![alt](` · `![alt](url` */
const PARTIAL_IMAGE_TAIL = /^!$|^!\[[^\]]*$|^!\[[^\]]*\]$|^!\[[^\]]*\]\([^)]*$/;

/** Vị trí bắt đầu phần đuôi phải giữ lại (chưa được nhả ra) vì có thể là thẻ ảnh dang dở.
 *  -1 nghĩa là toàn bộ buffer an toàn để nhả ra ngay. */
function partialImageStart(buf: string): number {
  const idx = buf.lastIndexOf('!');
  if (idx === -1) return -1;
  return PARTIAL_IMAGE_TAIL.test(buf.slice(idx)) ? idx : -1;
}

/**
 * Lọc bỏ thẻ ảnh markdown `![alt](url)` khỏi một stream văn bản.
 *
 * Ảnh bằng chứng (`type: image`) chỉ là dữ liệu xác minh nội bộ, KHÔNG BAO GIỜ được hiển thị cho
 * người dùng (xem AGENTS.md mục 4) — đây là lưới an toàn cứng, không phụ thuộc việc LLM có tuân
 * thủ prompt hay không. Vì một thẻ ảnh có thể bị cắt làm đôi giữa 2 chunk khi stream, hàm này giữ
 * lại phần đuôi khả nghi cho tới khi chắc chắn nó không phải mở đầu của một thẻ ảnh.
 */
export async function* stripImagesFromStream(
  source: AsyncIterable<string>
): AsyncIterable<string> {
  let buf = '';

  for await (const chunk of source) {
    buf = (buf + chunk).replace(COMPLETE_IMAGE_TAG, '');

    const hold = partialImageStart(buf);
    if (hold === -1) {
      if (buf) yield buf;
      buf = '';
    } else if (hold > 0) {
      yield buf.slice(0, hold);
      buf = buf.slice(hold);
    }
    // hold === 0 → cả buffer đang là thẻ ảnh dang dở, giữ lại toàn bộ chờ chunk sau
  }

  // Hết stream: phần giữ lại nếu vẫn dang dở thì không phải thẻ ảnh thật, nhả ra nốt
  buf = buf.replace(COMPLETE_IMAGE_TAG, '');
  if (buf) yield buf;
}

/** Bọc một chuỗi cố định thành stream, để mọi nhánh của pipeline có chung một hợp đồng trả về. */
export async function* textToStream(text: string): AsyncIterable<string> {
  yield text;
}
