import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const getIconSrcError = (fileName: string) => {
  if (
    fileName?.endsWith(".png") ||
    fileName?.endsWith(".jpg") ||
    fileName?.endsWith(".jpeg") ||
    fileName?.endsWith(".jfif") ||
    fileName?.endsWith(".webp") ||
    fileName?.endsWith(".svg") ||
    fileName?.endsWith(".ico") ||
    fileName?.endsWith(".gif")
  ) {
    return toAbsoluteUrl("/media/extensions/png.webp");
  } else if (fileName?.endsWith(".pdf")) {
    return toAbsoluteUrl("/media/extensions/pdfIcon.webp");
  } else if (fileName?.endsWith(".doc") || fileName?.endsWith(".docx")) {
    return toAbsoluteUrl("/media/extensions/wordIcon.webp");
  } else if (fileName?.endsWith(".xls") || fileName?.endsWith(".xlsx")) {
    return toAbsoluteUrl("/media/extensions/excelIcon.webp");
  } else if (fileName?.endsWith(".txt")) {
    return toAbsoluteUrl("/media/extensions/textIcon.webp");
  } else if (
    fileName?.endsWith(".mp4") ||
    fileName?.endsWith(".webm") ||
    fileName?.endsWith(".avi") ||
    fileName?.endsWith(".mkv") ||
    fileName?.endsWith(".flv") ||
    fileName?.endsWith(".ts")
  ) {
    return toAbsoluteUrl("/media/extensions/video.webp");
  } else if (
    fileName?.endsWith(".ppt") ||
    fileName?.endsWith(".pptx") ||
    fileName?.endsWith(".pptm") ||
    fileName?.endsWith(".pps") ||
    fileName?.endsWith(".ppsx") ||
    fileName?.endsWith(".ppsm")
  ) {
    return toAbsoluteUrl("/media/extensions/powerPointIcon.webp");
  }

  return undefined;
};

export default getIconSrcError;
