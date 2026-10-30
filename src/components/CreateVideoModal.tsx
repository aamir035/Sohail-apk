import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  Camera, 
  Video as VideoIcon, 
  Sparkles, 
  Play, 
  Square, 
  Check, 
  Film, 
  Hash, 
  AlertCircle 
} from 'lucide-react';
import { Video } from '../types';

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateVideoModal: React.FC<CreateVideoModalProps> = ({ isOpen, onClose }) => {
  const { user, uploadVideo, showToast } = useApp();

  const [mode, setMode] = useState<'upload' | 'camera' | 'samples'>('samples');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hashtags, setHashtags] = useState<string>('ShortsPK, Pakistan, EarningApp');
  const [category, setCategory] = useState<Video['category']>('Entertainment');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Camera Recording States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Sample templates for instant testing
  const sampleTemplates = [
    {
      title: 'Delicious Lahori Gol Gappay on Food Street 🔥🤤',
      description: 'Crispy, tangy khatta pani and meethi chutney in Old Lahore! Watch till end. #LahoreFood #FoodStreet #GolGappay',
      category: 'Food' as const,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-a-dish-in-a-pan-42526-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
      hashtags: 'LahoreFood, FoodStreet, GolGappay, ShortsPK'
    },
    {
      title: 'Rawalpindi Tape Ball Cricket Tournament Sixers! 🏏⚡',
      description: 'Massive six over the building in Raja Bazar night match! Like and share. #TapeBall #Rawalpindi #CricketPK',
      category: 'Cricket' as const,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-cricket-in-a-field-42416-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
      hashtags: 'TapeBall, Rawalpindi, CricketPK, Sixer'
    },
    {
      title: 'Attabad Lake Skardu Turquoise Waters Drone View 🏞️',
      description: 'Unbelievable blue waters in Northern Pakistan. Heaven on Earth! #AttabadLake #Gilgit #PakistanZindabad',
      category: 'Motivation' as const,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-valley-during-sunset-41793-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
      hashtags: 'AttabadLake, Gilgit, PakistanTourism, BeautifulPK'
    }
  ];

  // Camera cleanups
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
    } catch (err) {
      showToast('Camera access denied or unavailable. You can upload a file or choose a Pakistani sample video.', 'error');
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
      const recordedUrl = URL.createObjectURL(blob);
      setVideoUrl(recordedUrl);
      setThumbnailUrl(user.avatar);
      showToast('Recording saved! Fill details to publish.', 'success');
      stopCameraStream();
    };

    recorder.start();
    setIsRecording(true);
    setRecordSeconds(0);

    const interval = setInterval(() => {
      setRecordSeconds(prev => {
        if (prev >= 60) {
          // Max 60 seconds
          stopRecording();
          clearInterval(interval);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showToast('File size must be under 50MB.', 'error');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setThumbnailUrl('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80');
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    showToast('Video loaded successfully! Add title & publish.', 'success');
  };

  const handleSelectSample = (sample: typeof sampleTemplates[0]) => {
    setTitle(sample.title);
    setDescription(sample.description);
    setCategory(sample.category);
    setVideoUrl(sample.videoUrl);
    setThumbnailUrl(sample.thumbnailUrl);
    setHashtags(sample.hashtags);
    showToast('Selected sample template! You can publish now.', 'info');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      showToast('Please select or record a video first!', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('Please enter a video title!', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const parsedHashtags = hashtags
              .split(',')
              .map(h => h.trim().replace(/^#/, ''))
              .filter(Boolean);

            uploadVideo({
              videoUrl,
              thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
              title: title.trim(),
              description: description.trim() || title.trim(),
              hashtags: parsedHashtags.length > 0 ? parsedHashtags : ['ShortsPK', 'Pakistan'],
              category,
              creatorId: user.id,
              creatorName: user.fullName,
              creatorUsername: user.username,
              creatorAvatar: user.avatar,
              creatorVerified: true,
              duration: 15,
              musicTitle: 'Original Audio - ' + user.fullName
            });
            onClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Create Short Video</h2>
              <p className="text-[11px] text-slate-400">Earn 80 Coins per 1,000 views</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-950/70 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              stopCameraStream();
              setMode('samples');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'samples'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => {
              stopCameraStream();
              setMode('upload');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'upload'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Gallery / File</span>
          </button>

          <button
            onClick={() => {
              setMode('camera');
              startCamera();
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'camera'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Record Camera</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* SAMPLES MODE */}
          {mode === 'samples' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">
                Choose a Trending Pakistani Template:
              </label>
              <div className="space-y-2.5">
                {sampleTemplates.map((tmpl, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSample(tmpl)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      videoUrl === tmpl.videoUrl
                        ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={tmpl.thumbnailUrl}
                      alt={tmpl.title}
                      className="w-14 h-18 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-rose-400">
                        {tmpl.category}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate mt-1">{tmpl.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{tmpl.description}</p>
                    </div>
                    {videoUrl === tmpl.videoUrl && (
                      <Check className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD MODE */}
          {mode === 'upload' && (
            <div className="space-y-3">
              <label className="block p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-rose-500 text-center cursor-pointer transition-colors bg-slate-950/50">
                <Upload className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                <span className="text-sm font-bold text-white block">
                  Select Video from Phone or PC
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  MP4, WebM (Max duration 60s, under 50MB)
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* CAMERA RECORDING MODE */}
          {mode === 'camera' && (
            <div className="space-y-3 text-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[9/14] max-h-64 mx-auto bg-black border border-slate-700 flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isRecording && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span>REC {recordSeconds}s / 60s</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="py-2.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="py-2.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Square className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Stop & Save Clip</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Video Metadata Inputs */}
          <form onSubmit={handlePublish} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Video Title *
              </label>
              <input
                type="text"
                required
                placeholder="Give your short video a catchy Pakistani title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="What is this video about? Add credits or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="Cricket">Cricket 🏏</option>
                  <option value="Food">Food & Cooking 🍲</option>
                  <option value="Comedy">Comedy & Memes 😂</option>
                  <option value="Technology">Tech & Earning 📱</option>
                  <option value="Motivation">Travel & Nature 🏔️</option>
                  <option value="Music">Music & Rabab 🎵</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  placeholder="ShortsPK, Lahore, Cricket"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">Publishing to AS Shorts CDN...</span>
                  <span className="text-rose-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Publish Button */}
            <button
              type="submit"
              disabled={isUploading || !videoUrl}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                isUploading || !videoUrl
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                  : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-rose-600/20 cursor-pointer'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUploading ? 'Publishing Video...' : 'Publish to AS Shorts 🚀'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
