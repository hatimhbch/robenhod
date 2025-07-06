import { Component, createSignal, Show } from 'solid-js';
import { githubService } from '../../services/githubService';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  disabled?: boolean;
  currentImageUrl?: string;
}

const ImageUpload: Component<ImageUploadProps> = (props) => {
  const [isUploading, setIsUploading] = createSignal(false);
  const [uploadError, setUploadError] = createSignal('');
  const [previewUrl, setPreviewUrl] = createSignal('');
  const [dragOver, setDragOver] = createSignal(false);

  let fileInputRef: HTMLInputElement | undefined;

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setUploadError('');
    setIsUploading(true);

    try {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const imageUrl = await githubService.uploadImage(file);
      props.onImageUploaded(imageUrl);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload image');
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileSelector = () => {
    fileInputRef?.click();
  };

  const removeImage = () => {
    setPreviewUrl('');
    props.onImageUploaded('');
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  };

  const currentImage = () => previewUrl() || props.currentImageUrl || '';

  return (
    <div class="space-y-4">
      <label class="block text-sm font-semibold text-gray-700">
        Article Image
      </label>
      
      {/* Image Preview */}
      <Show when={currentImage()}>
        <div class="relative inline-block">
          <img
            src={currentImage()}
            alt="Preview"
            class="max-w-full h-48 object-cover rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={removeImage}
            disabled={props.disabled || isUploading()}
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            ×
          </button>
        </div>
      </Show>

      {/* Upload Area */}
      <Show when={!currentImage()}>
        <div
          class={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver() 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${
            props.disabled || isUploading() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileSelector}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={props.disabled || isUploading()}
            class="hidden"
          />
          
          <Show when={isUploading()}>
            <div class="space-y-2">
              <svg class="mx-auto h-8 w-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-sm text-gray-600">Uploading image...</p>
            </div>
          </Show>
          
          <Show when={!isUploading()}>
            <div class="space-y-2">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="text-sm text-gray-600">
                  <span class="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
              </div>
            </div>
          </Show>
        </div>
      </Show>

      {/* Error Message */}
      <Show when={uploadError()}>
        <div class="bg-red-50 border border-red-200 rounded-md p-3">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="ml-2 text-sm text-red-700">{uploadError()}</p>
          </div>
        </div>
      </Show>

      <p class="text-xs text-gray-500">
        Images will be uploaded to GitHub and publicly accessible. The URL will be automatically added to your article.
      </p>
    </div>
  );
};

export default ImageUpload; 