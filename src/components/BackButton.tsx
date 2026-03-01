import { Button } from '@/components/Button';
import { ButtonVariant } from '@/enums/button-variant.enum';
import Link from 'next/link';

export default function BackButton({ href, tooltip }: { href: string; tooltip: string }) {
    return (
        <div className="relative group">
            <Link href={href}>
                <Button variant={ButtonVariant.PRIMARY}>←</Button>
            </Link>

            <span
                className="absolute left-10 top-1/2 -translate-y-1/2
                bg-navbar-bg text-navbar-text text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100 transition-opacity duration-100
                pointer-events-none whitespace-nowrap"
            >
                {tooltip}
            </span>
        </div>
    );
}
