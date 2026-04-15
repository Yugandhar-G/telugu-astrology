import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';

let driveClient: drive_v3.Drive | null = null;

function getDriveClient(): drive_v3.Drive {
  if (driveClient) return driveClient;

  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing GOOGLE_DRIVE_CLIENT_EMAIL or GOOGLE_DRIVE_PRIVATE_KEY environment variables'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  driveClient = google.drive({ version: 'v3', auth });
  return driveClient;
}

function getFolderId(): string {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID environment variable');
  }
  return folderId;
}

export async function uploadJSON(
  filename: string,
  data: Record<string, unknown>
): Promise<string> {
  const drive = getDriveClient();
  const folderId = getFolderId();

  const existing = await drive.files.list({
    q: `name='${filename}' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
  });

  const body = JSON.stringify(data, null, 2);
  const media = {
    mimeType: 'application/json',
    body: Readable.from(Buffer.from(body)),
  };

  if (existing.data.files && existing.data.files.length > 0) {
    const fileId = existing.data.files[0].id!;
    await drive.files.update({ fileId, media });
    return fileId;
  }

  const res = await drive.files.create({
    requestBody: {
      name: filename,
      mimeType: 'application/json',
      parents: [folderId],
    },
    media,
    fields: 'id',
  });

  return res.data.id!;
}

export async function uploadPDF(
  filename: string,
  pdfBuffer: Buffer
): Promise<string> {
  const drive = getDriveClient();
  const folderId = getFolderId();

  const existing = await drive.files.list({
    q: `name='${filename}' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id)',
  });

  const media = {
    mimeType: 'application/pdf',
    body: Readable.from(pdfBuffer),
  };

  if (existing.data.files && existing.data.files.length > 0) {
    const fileId = existing.data.files[0].id!;
    await drive.files.update({ fileId, media });
    return fileId;
  }

  const res = await drive.files.create({
    requestBody: {
      name: filename,
      mimeType: 'application/pdf',
      parents: [folderId],
    },
    media,
    fields: 'id',
  });

  return res.data.id!;
}

export interface DriveChartFile {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
}

export async function listChartFiles(): Promise<DriveChartFile[]> {
  const drive = getDriveClient();
  const folderId = getFolderId();

  const res = await drive.files.list({
    q: `'${folderId}' in parents and name contains 'chart_' and mimeType='application/json' and trashed=false`,
    fields: 'files(id, name, createdTime, modifiedTime)',
    orderBy: 'createdTime desc',
  });

  return (res.data.files || []).map((f) => ({
    id: f.id!,
    name: f.name!,
    createdTime: f.createdTime!,
    modifiedTime: f.modifiedTime!,
  }));
}

export async function getFileContent(fileId: string): Promise<string> {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' }
  );
  return res.data as string;
}

export async function getFileBuffer(fileId: string): Promise<Buffer> {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(res.data as ArrayBuffer);
}

export async function deleteFile(fileId: string): Promise<void> {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

export async function findPDFForChart(chartId: string): Promise<string | null> {
  const drive = getDriveClient();
  const folderId = getFolderId();

  const res = await drive.files.list({
    q: `'${folderId}' in parents and name contains '${chartId}' and mimeType='application/pdf' and trashed=false`,
    fields: 'files(id)',
  });

  const files = res.data.files || [];
  return files.length > 0 ? files[0].id! : null;
}

export async function getFileWebViewLink(fileId: string): Promise<string> {
  const drive = getDriveClient();
  const res = await drive.files.get({
    fileId,
    fields: 'webViewLink, webContentLink',
  });
  return res.data.webContentLink || res.data.webViewLink || '';
}
