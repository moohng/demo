
export type ImageHostType = 'sm.ms' | 'github' | 'custom';

export interface ImageConfig {
  type: ImageHostType;
  token?: string;
  repo?: string; // GitHub: 'username/repo'
  branch?: string; // GitHub: default 'main'
  dir?: string; // GitHub: Upload directory (default: 'images')
  customUrl?: string; // Reserved for future custom uploaders
}

export interface UploadResult {
  url: string;
  filename: string;
}

/**
 * Uploads an image to the configured host.
 */
export async function uploadImage(file: File, config: ImageConfig): Promise<UploadResult> {
  const { type, token } = config;

  if (type === 'sm.ms') {
    return uploadToSmMs(file, token);
  } else if (type === 'github') {
    return uploadToGitHub(file, config);
  }

  throw new Error(`Unsupported image host: ${type}`);
}

async function uploadToSmMs(file: File, token?: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('smfile', file);

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = token;
  }

  try {
    const response = await fetch('https://sm.ms/api/v2/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        url: data.data.url,
        filename: data.data.filename
      };
    } else if (data.code === 'image_repeated') {
      return {
        url: data.images,
        filename: file.name
      };
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error('Upload Error:', error);
    throw new Error(error.message || 'Network error');
  }
}

async function uploadToGitHub(file: File, config: ImageConfig): Promise<UploadResult> {
  const { token, repo, branch = 'main', dir = 'images' } = config;

  if (!token || !repo) {
    throw new Error('GitHub configuration missing: Token and Repo are required.');
  }

  const base64Content = await fileToBase64(file);
  // Generate unique filename: YYYYMMDDHHmmss_filename
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;

  // Clean dir path (remove leading/trailing slashes)
  const cleanDir = dir.replace(/^\/+|\/+$/g, '');
  const path = cleanDir ? `${cleanDir}/${filename}` : filename;

  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Upload image via WeMark: ${filename}`,
        content: base64Content,
        branch
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'GitHub upload failed');
    }

    // Construct jsDelivr URL for CDN access
    // https://cdn.jsdelivr.net/gh/user/repo@version/file
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${repo}@${branch}/${path}`;

    return {
      url: cdnUrl,
      filename: filename
    };

  } catch (error: any) {
    console.error('GitHub Upload Error:', error);
    throw new Error(error.message || 'GitHub Upload Failed');
  }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/png;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
