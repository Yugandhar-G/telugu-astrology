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

export async function generateKundaliPDF(
  element: HTMLElement,
  filename: string = 'kundali.pdf'
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  let headerImg: HTMLImageElement | null = null;
  try {
    headerImg = await loadImage(HEADER_IMAGE_PATH);
  } catch {
    // Header image failed to load - continue without it
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = 210;
  const pdfHeight = 297;

  let currentY = 0;

  // Add header if loaded
  if (headerImg) {
    const headerHeight = (headerImg.height * pdfWidth) / headerImg.width;
    pdf.addImage(headerImg, 'PNG', 0, 0, pdfWidth, headerHeight);
    currentY = headerHeight + 5; // 5mm padding
  }

  const contentWidth = pdfWidth;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // If content fits on the rest of the page
  if (currentY + contentHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, currentY, contentWidth, contentHeight);
  } else {
    // Multi-page logic
    let heightLeft = contentHeight;
    let position = currentY;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, contentWidth, contentHeight);
    heightLeft -= (pdfHeight - position);

    while (heightLeft > 0) {
      pdf.addPage();

      // Calculate position relative to the top of the image being rendered off-canvas
      // This simple loop logic from original code was a bit naive for offsets, let's stick to standard simple paging
      // Actually, standard approach:
      position = -(contentHeight - heightLeft); // Negative offset to show bottom part

      // But wait, the original code logic:
      // position = heightLeft - imgHeight; 
      // is for "rendering the remaining part"?

      // Let's use a simpler approach for multi-page canvas:
      pdf.addImage(imgData, 'PNG', 0, - (contentHeight - heightLeft), contentWidth, contentHeight);
      heightLeft -= pdfHeight;
    }
  }

  pdf.save(filename);
}

export async function generateMatchmakingPDF(
  element: HTMLElement,
  filename: string = 'matchmaking.pdf'
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  let headerImg: HTMLImageElement | null = null;
  try {
    headerImg = await loadImage(HEADER_IMAGE_PATH);
  } catch {
    // Header image failed to load - continue without it
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = 210;
  const pdfHeight = 297;

  let currentY = 0;

  // Add header if loaded
  if (headerImg) {
    const headerHeight = (headerImg.height * pdfWidth) / headerImg.width;
    pdf.addImage(headerImg, 'PNG', 0, 0, pdfWidth, headerHeight);
    currentY = headerHeight + 5; // 5mm padding
  }

  const contentWidth = pdfWidth;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // Multi-page handling
  let heightLeft = contentHeight;
  let position = currentY;

  pdf.addImage(imgData, 'PNG', 0, position, contentWidth, contentHeight);
  heightLeft -= (pdfHeight - position);

  while (heightLeft > 0) {
    position = heightLeft - contentHeight; // This logic from before seems flaky for offsets with headers
    pdf.addPage();
    // Simplified: Just put the image shifted up
    // The previous logic was: position = heightLeft - imgHeight;
    // Which means: Y = Remaining - TotalHeight. (Negative value).

    // Correct logic for subsequent pages:
    // We want to print the slice starting at (ContentHeight - HeighLeft)
    // So we place the image at Y = -(ContentHeight - HeightLeft)
    const offset = contentHeight - heightLeft;
    pdf.addImage(imgData, 'PNG', 0, -offset, contentWidth, contentHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
}
