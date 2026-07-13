import { FiLinkedin, FiMail, FiShare2 } from "react-icons/fi";
import { SiWhatsapp } from "react-icons/si";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: FiLinkedin },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, icon: SiWhatsapp },
    { label: "E-mail", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, icon: FiMail },
  ];

  return (
    <div className="border-y border-white/[.08] py-6">
      <p className="flex items-center gap-2 text-sm font-bold text-white"><FiShare2 className="text-[#b8ff5c]" aria-hidden="true" /> Compartilhe este artigo</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map(({ label, href, icon: Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Compartilhar no ${label}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[.1] bg-white/[.035] px-4 text-xs font-bold text-zinc-200 outline-none transition-[background-color,border-color,color] hover:border-white/[.18] hover:bg-white/[.07] hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400">
            <Icon aria-hidden="true" /> {label}
          </a>
        ))}
      </div>
    </div>
  );
}
