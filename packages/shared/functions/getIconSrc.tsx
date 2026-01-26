import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

const getIconSrc = (fileName?: string, file?: any, rootUrl?: string) => {
  if (file?.path == "" || file?.filepath == "" || file?.filePath == "") {
    return toAbsoluteUrl("/media/avatars/avtar.webp");
  }
  if (
    fileName?.endsWith(".png") ||
    fileName?.endsWith(".PNG") || 
    fileName?.endsWith(".jpg") ||
    fileName?.endsWith(".JPG") ||
    fileName?.endsWith(".jpeg") ||
    fileName?.endsWith(".jfif") ||
    fileName?.endsWith(".webp") ||
    fileName?.endsWith(".svg") ||
    fileName?.endsWith(".ico") ||
    fileName?.endsWith(".gif") 
  ) {
    // return file?.path
    //   ? `${rootUrl}${file?.path}`
    //   : file?.size
    //     ? URL.createObjectURL(file)
    //     : "";
    if (file?.path || file?.filepath || file?.filePath) {
      if (rootUrl?.endsWith("/"))
        return `${rootUrl}${file?.path || file?.filepath || file?.filePath}`;
      else
        return `${rootUrl}/${file?.path || file?.filepath || file?.filePath}`;
    } else if (file?.size) {
      return URL.createObjectURL(file);
    }
    return "";
  } else if (fileName?.endsWith(".pdf")) {
    return toAbsoluteUrl("/media/extensions/pdfIcon.webp");
  } else if (fileName?.endsWith(".doc") || fileName?.endsWith(".docx")) {
    return toAbsoluteUrl("/media/extensions/wordIcon.webp");
  } else if (fileName?.endsWith(".xls") || fileName?.endsWith(".xlsx")) {
    return toAbsoluteUrl("/media/extensions/excelIcon2.webp");
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

  return toAbsoluteUrl("/media/extensions/blankImg.webp")
};

export default getIconSrc;
