// Enhanced media type support with content processing
import { generateImageHash } from './imghash';

export type MediaType = 'image' | 'video' | 'audio' | 'text';

export interface MediaMetadata {
  type: MediaType;
  mimeType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for video/audio
  transcription?: string; // for audio
  wordCount?: number; // for text
  hash: string;
}

export interface MediaAsset {
  file: File;
  metadata: MediaMetadata;
  preview?: string;
}

// Process different media types
export async function processMedia(file: File): Promise<MediaAsset> {
  const type = getMediaType(file.type);
  let metadata: MediaMetadata;

  switch (type) {
    case 'image':
      metadata = await processImage(file);
      break;
    case 'video':
      metadata = await processVideo(file);
      break;
    case 'audio':
      metadata = await processAudio(file);
      break;
    case 'text':
      metadata = await processText(file);
      break;
    default:
      throw new Error('Unsupported media type');
  }

  return {
    file,
    metadata,
    preview: type === 'image' ? URL.createObjectURL(file) : undefined,
  };
}

function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || mimeType === 'application/pdf') return 'text';
  throw new Error('Unsupported media type');
}

async function processImage(file: File): Promise<MediaMetadata> {
  const hashResult = await generateImageHash(file);
  
  return {
    type: 'image',
    mimeType: file.type,
    fileSize: file.size,
    dimensions: {
      width: hashResult.width,
      height: hashResult.height,
    },
    hash: hashResult.hash,
  };
}

async function processVideo(file: File): Promise<MediaMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        type: 'video',
        mimeType: file.type,
        fileSize: file.size,
        dimensions: {
          width: video.videoWidth,
          height: video.videoHeight,
        },
        duration: video.duration,
        hash: '', // Implement video hashing
      });
    };
    
    video.src = URL.createObjectURL(file);
  });
}

async function processAudio(file: File): Promise<MediaMetadata> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve({
        type: 'audio',
        mimeType: file.type,
        fileSize: file.size,
        duration: audio.duration,
        hash: '', // Implement audio fingerprinting
      });
    };
    
    audio.src = URL.createObjectURL(file);
  });
}

async function processText(file: File): Promise<MediaMetadata> {
  const text = await file.text();
  const wordCount = text.trim().split(/\s+/).length;
  
  return {
    type: 'text',
    mimeType: file.type,
    fileSize: file.size,
    wordCount,
    hash: '', // Implement text fingerprinting
  };
}