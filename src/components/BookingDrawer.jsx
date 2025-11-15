import { X } from 'lucide-react';
import { useRef } from 'react';
import BookingForm from './BookingForm';

export default function BookingDrawer({ open, onClose, initial }) {
  if (!open) return null;
  const dirtyRef = useRef(false);
  const setDirty = (v) => { dirtyRef.current = v; };
  const handleClose = (payload) => {
    const isEdit = Boolean(initial?.id);
    if (isEdit && dirtyRef.current && !payload) {
      const sure = window.confirm('Discard unsaved changes?');
      if (!sure) return;
    }
    onClose && onClose(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={() => handleClose()}
      ></div>
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-black via-gray-900 to-black border-b border-white/10 backdrop-blur-xl">
          <div className="flex justify-between items-center p-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                {initial?.id ? 'Edit Booking' : `Book ${initial?.title || 'Your Service'}`}
              </h3>
              <p className="text-white/60 text-sm mt-1">
                {initial?.id ? 'Update your booking details' : "Fill in your details and we'll come to you"}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => handleClose()} 
              aria-label="Close"
              className="p-2 hover:bg-white/10 transition-colors border border-white/20 hover:border-primary/50"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <BookingForm 
            initial={initial?.id ? initial : { service: initial?.key }} 
            onDirtyChange={setDirty}
            onSaved={(b) => { handleClose(b); }} 
          />
        </div>
      </div>
    </div>
  );
}
