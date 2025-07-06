import { Component, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { articleService, ArticleRequest } from '../../services/articleService';
import ImageUpload from '../common/ImageUpload';

const CreateArticle: Component = () => {
  const navigate = useNavigate();
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [content, setContent] = createSignal('');
  const [slug, setSlug] = createSignal('');
  const [imageUrl, setImageUrl] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug() || slug() === generateSlug(title())) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!title().trim() || !description().trim() || !content().trim() || !slug().trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (title().trim().length > 255) {
      setError('Title must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    if (description().trim().length > 255) {
      setError('Description must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    if (slug().trim().length > 255) {
      setError('URL slug must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    if (imageUrl().trim().length > 255) {
      setError('Image URL must be less than 255 characters');
      setIsLoading(false);
      return;
    }

    try {
      const articleRequest: ArticleRequest = {
        title: title().trim(),
        description: description().trim(),
        content: content().trim(),
        slug: slug().trim(),
        imageUrl: imageUrl().trim()
      };

      console.log('Submitting article request:', articleRequest);
      const createdArticle = await articleService.createArticle(articleRequest);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/${createdArticle.authorUsername}/${createdArticle.slug}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };
 
  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-neutral-900 mb-6">Create New Article</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share your thoughts and stories with our community. Express your creativity and connect with readers around the world.
          </p>
        </div>

        <div class="prose prose-lg max-w-none">
          {/* Success Message */}
          <Show when={success()}>
            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700 font-medium">
                    Article created successfully! Redirecting...
                  </p>
                </div>
              </div>
            </div>
          </Show>

          {/* Error Message */}
          <Show when={error()}>
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700 font-medium">{error()}</p>
                </div>
              </div>
            </div>
          </Show>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-8">
            {/* Title Field */}
            <div>
              <input
                id="title"
                type="text"
                value={title()}
                onInput={(e) => handleTitleChange(e.currentTarget.value)}
                placeholder="Enter an engaging title for your article..."
                class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading() || success()}
                required
                maxLength={255}
              />
            </div>


            {/* Description Field */}
            <div>
              <input
                id="description"
                type="text"
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                placeholder="Enter an engaging description for your article..."
                class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading() || success()}
                required
                maxLength={255}
              />
            </div>


            {/* Slug Field */}
            <div>
              <input
                id="slug"
                type="text"
                value={slug()}
                onInput={(e) => setSlug(e.currentTarget.value)}
                placeholder="article-url-slug"
                class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading() || success()}
                required
                maxLength={255}
              />
            </div>

            {/* Content Field */}
            <div>
              <textarea
                id="content"
                value={content()}
                onInput={(e) => setContent(e.currentTarget.value)}
                placeholder="Write your article content here... You can use Markdown formatting!"
                rows={15}
                class="w-full px-6 py-4 border text-sm bg-white border-neutral-700 rounded-4xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[300px]"
                disabled={isLoading() || success()}
                required
              />
            </div>

            {/* Image Upload Field */}
            <div>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                disabled={isLoading() || success()}
                currentImageUrl={imageUrl()}
              />
            </div>

            {/* Action Buttons */}
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading() || success()}
                class="w-full bg-neutral-900 text-white px-6 py-4 text-sm rounded-full hover:bg-neutral-800 transition-colors font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading() ? 'Publishing...' : 'Publish Article'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading() || success()}
                class="w-full bg-gray-100 text-gray-700 px-6 py-4 text-sm rounded-full hover:bg-gray-200 transition-colors font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          <div class="text-center bg-gray-50 rounded-2xl p-12 mt-16">
            <h2 class="text-3xl font-bold text-neutral-900 mb-6">Writing Tips for Success</h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Create engaging content that resonates with your audience. Here are some tips to help you craft compelling articles.
            </p>
            <div class="grid md:grid-cols-2 gap-12 text-left">
              <div>
                <h3 class="text-xl font-bold text-neutral-900 mb-4">Content Guidelines</h3>
                <p class="text-gray-600 leading-relaxed">
                  Write compelling titles that grab attention. Start with strong opening paragraphs and use clear, 
                  concise language throughout. Break up your text with headings and well-structured paragraphs for better readability.
                </p>
              </div>
              <div>
                <h3 class="text-xl font-bold text-neutral-900 mb-4">Formatting & Style</h3>
                <p class="text-gray-600 leading-relaxed">
                  Use Markdown for formatting: **bold** for emphasis, *italic* for subtle emphasis, 
                  create lists with - or *, add links with [text](url). Upload images directly in supported formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle; 