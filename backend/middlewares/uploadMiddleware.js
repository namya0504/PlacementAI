import multer from 'multer';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

export const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, PDF, and DOCX documents are allowed.'), false);
    }
  }
});

const ALLOWED_AUDIO_TYPES = [
  'audio/webm',
  'video/webm',
  'audio/ogg',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/mp4',
  'audio/mpeg',
  'audio/aac',
  'application/octet-stream' // In case browser sends raw blob
];

export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit for audio answers
  },
  fileFilter: (req, file, cb) => {
    if (
      ALLOWED_AUDIO_TYPES.includes(file.mimetype) ||
      file.mimetype.startsWith('audio/') ||
      file.originalname.match(/\.(webm|ogg|wav|mp3|m4a|aac)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format. Please upload webm, ogg, wav, or mp3 audio.'), false);
    }
  }
});
