const HEADER_IMAGE_PATH = '/bhaskar bharadwaj.png';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

const PDF_WIDTH_MM = 210;
const PDF_HEIGHT_MM = 297;
const MARGIN_MM = 5;

async function captureElement(element: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    scrollY: -window.scrollY,
    windowHeight: element.scrollHeight,
  });
}

function sliceCanvasToPages(
  canvas: HTMLCanvasElement,
  headerImg: HTMLImageElement | null
) {
  const contentWidthMM = PDF_WIDTH_MM;
  const scale = canvas.width / contentWidthMM;

  let headerHeightMM = 0;
  if (headerImg) {
    headerHeightMM = (headerImg.height * contentWidthMM) / headerImg.width;
  }

  const firstPageContentMM = PDF_HEIGHT_MM - headerHeightMM - MARGIN_MM;
  const subsequentPageContentMM = PDF_HEIGHT_MM - MARGIN_MM * 2;

  const totalContentMM = (canvas.height / scale);
  const pages: { sx: number; sy: number; sw: number; sh: number; isFirst: boolean }[] = [];

  let remainingMM = totalContentMM;
  let currentSourceY = 0;

  // First page
  const firstSliceMM = Math.min(remainingMM, firstPageContentMM);
  const firstSlicePx = Math.round(firstSliceMM * scale);
  pages.push({
    sx: 0,
    sy: currentSourceY,
    sw: canvas.width,
    sh: firstSlicePx,
    isFirst: true,
  });
  currentSourceY += firstSlicePx;
  remainingMM -= firstSliceMM;

  while (remainingMM > 0.5) {
    const sliceMM = Math.min(remainingMM, subsequentPageContentMM);
    const slicePx = Math.round(sliceMM * scale);
    pages.push({
      sx: 0,
      sy: currentSourceY,
      sw: canvas.width,
      sh: Math.min(slicePx, canvas.height - currentSourceY),
      isFirst: false,
    });
    currentSourceY += slicePx;
    remainingMM -= sliceMM;
  }

  return { pages, headerHeightMM, scale };
}

async function buildPDF(
  element: HTMLElement,
  mode: 'save' | 'blob',
  filename?: string
) {
  const { default: jsPDF } = await import('jspdf');
  const canvas = await captureElement(element);

  let headerImg: HTMLImageElement | null = null;
  try {
    headerImg = await loadImage(HEADER_IMAGE_PATH);
  } catch {
    // continue without header
  }

  const { pages, headerHeightMM, scale } = sliceCanvasToPages(canvas, headerImg);
  const pdf = new jsPDF('p', 'mm', 'a4');

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (i > 0) pdf.addPage();

    let yOffset = MARGIN_MM;

    if (page.isFirst && headerImg) {
      pdf.addImage(headerImg, 'PNG', 0, 0, PDF_WIDTH_MM, headerHeightMM);
      yOffset = headerHeightMM + MARGIN_MM;
    }

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = page.sw;
    sliceCanvas.height = page.sh;
    const ctx = sliceCanvas.getContext('2d')!;
    ctx.drawImage(canvas, page.sx, page.sy, page.sw, page.sh, 0, 0, page.sw, page.sh);

    const sliceData = sliceCanvas.toDataURL('image/png');
    const sliceWidthMM = page.sw / scale;
    const sliceHeightMM = page.sh / scale;

    pdf.addImage(sliceData, 'PNG', 0, yOffset, sliceWidthMM, sliceHeightMM);
  }

  if (mode === 'save') {
    pdf.save(filename || 'chart.pdf');
  } else {
    return pdf.output('blob');
  }
}

export async function generateKundaliPDF(
  element: HTMLElement,
  filename: string = 'kundali.pdf'
): Promise<void> {
  await buildPDF(element, 'save', filename);
}

export async function generateKundaliPDFBlob(
  element: HTMLElement
): Promise<Blob> {
  return (await buildPDF(element, 'blob')) as Blob;
}

export async function generateMatchmakingPDF(
  element: HTMLElement,
  filename: string = 'matchmaking.pdf'
): Promise<void> {
  await buildPDF(element, 'save', filename);
}

export async function generateMatchmakingPDFBlob(
  element: HTMLElement
): Promise<Blob> {
  return (await buildPDF(element, 'blob')) as Blob;
}
