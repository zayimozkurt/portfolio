import Link from 'next/link';

export default function BackButton({ href, tooltip }: { href: string; tooltip: string }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 font-mono text-xs text-text-tertiary
                bg-transparent border border-border-muted rounded-[9px] px-3.5 py-2 whitespace-nowrap
                hover:text-text-primary hover:border-text-muted transition-colors duration-150"
        >
            ← {tooltip}
        </Link>
    );
}
