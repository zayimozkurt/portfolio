import { ContactLabel } from '@/enums/contact-label.enum';
import { ExternalLink } from 'lucide-react';
import React from 'react';
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { SiBuymeacoffee, SiGumroad, SiReddit, SiUpwork } from 'react-icons/si';

export const contactIconMap: Record<string, React.ReactNode> = {
    [ContactLabel.YOUTUBE]: <FaYoutube />,
    [ContactLabel.EMAIL]: <FaEnvelope />,
    [ContactLabel.INSTAGRAM]: <FaInstagram />,
    [ContactLabel.X]: <FaXTwitter />,
    [ContactLabel.LINKEDIN]: <FaLinkedinIn />,
    [ContactLabel.GITHUB]: <FaGithub />,
    [ContactLabel.UPWORK]: <SiUpwork />,
    [ContactLabel.GUMROAD]: <SiGumroad />,
    [ContactLabel.REDDIT]: <SiReddit />,
    [ContactLabel.BUYMEACOFFEE]: <SiBuymeacoffee />,
    [ContactLabel.CUSTOM]: <ExternalLink size={16} />,
};
