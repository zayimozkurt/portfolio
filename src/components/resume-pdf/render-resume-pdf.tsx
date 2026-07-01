import { ExtendedUserModel } from '@/types/db/extended-user.model';
import { Font, renderToBuffer } from '@react-pdf/renderer';
import path from 'path';
import { ResumeDocument } from './ResumeDocument';

let fontsRegistered = false;

function registerFonts() {
    if (fontsRegistered) return;

    const dir = path.join(process.cwd(), 'public/fonts');
    Font.register({
        family: 'Tinos',
        fonts: [
            { src: path.join(dir, 'Tinos-Regular.ttf') },
            { src: path.join(dir, 'Tinos-Bold.ttf'), fontWeight: 'bold' },
            { src: path.join(dir, 'Tinos-Italic.ttf'), fontStyle: 'italic' },
            { src: path.join(dir, 'Tinos-BoldItalic.ttf'), fontWeight: 'bold', fontStyle: 'italic' },
        ],
    });
    // Keep URLs and long words intact instead of hyphenating them mid-string.
    Font.registerHyphenationCallback((word) => [word]);

    fontsRegistered = true;
}

export async function renderResumePdf(user: ExtendedUserModel): Promise<Buffer> {
    registerFonts();
    return renderToBuffer(<ResumeDocument user={user} />);
}
