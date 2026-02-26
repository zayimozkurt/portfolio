import { TOOLTIP_LINE_CHAR_LIMIT } from '@/constants/tooltip-line-char-limit.constant';

export function InfoTooltip({ text }: { text: string }) {
    function wrapText(input: string, limit: number) {
        const words = input.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
            if ((currentLine + word).length > limit) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });
        
        lines.push(currentLine.trim());
        return lines;
    }

    const formattedLines = wrapText(text, TOOLTIP_LINE_CHAR_LIMIT);

    return (
        <span className="relative group inline-flex items-center">
            <span className="flex items-center justify-center w-4 h-4 rounded-full border border-border-muted text-text-muted hover:text-text-tertiary text-[10px] font-semibold cursor-help duration-300">
                i
            </span>
            <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3 py-1.5 bg-surface border border-border-muted rounded-[10px] shadow-md text-xs text-text-secondary opacity-0 pointer-events-none group-hover:opacity-100 duration-300 min-w-max"
            >
                {formattedLines.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
        </span>
    );
}
