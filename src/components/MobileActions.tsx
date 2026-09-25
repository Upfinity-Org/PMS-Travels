import { MessageCircle, Phone } from 'lucide-react';
import { SITE } from '../config/site';

export function MobileActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-black/10 bg-white/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a href={`tel:${SITE.phone.tel}`} className="flex items-center justify-center gap-2 border-r border-black/10 py-2.5 text-sm font-bold">
        <Phone size={16} aria-hidden="true" /> Call Now
      </a>
      <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-primary">
        <MessageCircle size={17} aria-hidden="true" /> WhatsApp
      </a>
    </div>
  );
}
