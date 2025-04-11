'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons'; // ✅ Add this

const SocialMediaLinks = () => {
    return (
        <div className='flex flex-row gap-4'>
            <a href="https://github.com/dhwanibudhiraja04" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} size="1x" />
            </a>
            <a href="https://dhwanibudhiraja.com" target="_blank" rel="noopener noreferrer"> {/* ✅ Your website */}
                <FontAwesomeIcon icon={faGlobe} size="1x" />
            </a>
            <a href="https://www.linkedin.com/in/dhwanibudhiraja/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} size="1x" />
            </a>
        </div>
    );
};

export default SocialMediaLinks;
