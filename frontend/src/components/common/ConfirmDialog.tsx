import { Component, Show } from 'solid-js';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: Component<ConfirmDialogProps> = (props) => {
  console.log('ConfirmDialog render:', { isOpen: props.isOpen, title: props.title });
  
  return (
    <Show when={props.isOpen}>
      <div 
        class="fixed inset-0 z-[9999] overflow-y-auto" 
        style="background-color: rgba(0,0,0,0.5);"
        onClick={props.onCancel}
      >
        <div class="flex items-center justify-center min-h-screen p-4">
          {/* Dialog */}
          <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto" onClick={(e) => e.stopPropagation()}>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {props.title}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {props.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={props.onConfirm}
                disabled={props.isLoading}
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {props.isLoading ? 'Deleting...' : (props.confirmLabel || 'Delete')}
              </button>
              <button
                type="button"
                onClick={props.onCancel}
                disabled={props.isLoading}
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {props.cancelLabel || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default ConfirmDialog; 