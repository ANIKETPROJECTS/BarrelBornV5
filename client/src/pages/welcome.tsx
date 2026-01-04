import { Utensils, Star } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import logoImage from "@assets/Untitled_design_(20)_1765720426678.png";
import bgPattern from "@assets/dark_bg_pattern.png";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { hasPlayedAudio, audioError, isReady } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);

  const handleSocialClick = useCallback((url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, []);

  const handleReviewClick = useCallback(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // On mobile, use the direct reviews search URL
    // On desktop, use the search URL that opens the review box modal
    const reviewUrl = isMobile 
      ? "https://www.google.com/search?sca_esv=579435e9b1f4aa6c&sxsrf=AE3TifO50MVJshN0gwbaDgq-X0j3uwlj5Q:1766741079150&q=barrelborn+%7C+dine+and+draft+%7C+thane+reviews&uds=AOm0WdHv8vC2-lx9BAKuP6KMCsmN4ax5ipzZo5mTWoC027zHKwygrheywQvQWo5nabYtE3awGjTOfLcv47n8JXgAU_vspWoHIdrY_gCn48b00caS5xPTguRMfxz1t2k0GICz0dfCNTbKCvsfI-QouUmfqrhQ789Gk-m4zC7Lc_XRvfb9MeMxkvdwu5wz8DJwMC3S8-79GUjB6Togmu5iRJZf5gzXQSCHA9cVZCUep9cI7tWTjdP8aX2rZFCn-1rPdhxxXhbBJnXOPwRS2b4HRbMQ3fDOtdqv26t0el4kWrEIyGj5I9VRoU8g7lVsbcmeKHuUHbFS666DKu7PVqFc_2p21ybaz1vjFa2T-fkJqsxya303BLUgCaCB8hMrIYIc_fzbIPih5JxypW652OIuC1IAhlVJIytELdtwCn1ducwKymjtJe9df46kM6vy74Br2uByTtKHg4WrztuYnm7eAUlhLg_Js_coyXFuGPwpBPCEj7daG1iXOGA&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E9moAMXsS0ppftIa0AAstM4Kr0Fg3SDnjKoe8Exi64ssFBObqy6D1rku7YyUuVozeN2jiji9DWq2wiCxYBSFS6Kv53kzE6sZzRmH4EYSlkax2vvh_vNaBexWa-FdPkWwc5EF3NY%3D&sa=X&ved=2ahUKEwif-bqz99qRAxWGyDgGHdTeB10Qk8gLegQIGRAB&ictx=1&stq=1&cs=1&lei=V1ROad_xCIaR4-EP1L2f6AU#ebo=4"
      : "https://www.google.com/search?q=barrelborn+%7C+dine+and+draft+%7C+thane&sca_esv=579435e9b1f4aa6c&sxsrf=AE3TifMKJiOcA_0foKemaeqGQQg9dgk-cQ%3A1766738800477&ei=cEtOaYbrHLLl2roP_OrSUA&oq=barrel&gs_lp=Egxnd3Mtd2l6LXNlcnAiBmJhcnJlbCoCCAAyBBAjGCcyBBAjGCcyChAjGIAEGCcYigUyCxAAGIAEGJECGIoFMhAQABiABBixAxhDGIMBGIoFMgsQABiABBiRAhiKBTIQEAAYgAQYsQMYQxiDARiKBTIQEC4YgAQY0QMYQxjHARiKBTIIEAAYgAQYsQMyChAAGIAEGBQYhwJIxxtQxwNYwg5wAngAkAEAmAHPAaAB2gmqAQUwLjYuMbgBAcgBAPgBAZgCCKAC_QioAhDCAgoQABiwAxjWBBhHwgIHECMYJxjqAsICDRAuGMcBGCcY6gIYrwHCAhcQABiABBiRAhi0AhjnBhiKBRjqAtgBAcICCxAAGIAEGLEDGIMBwgIFEAAYgATCAg4QLhiABBixAxjRAxjHAcICERAAGIAEGLEDGIMBGIoFGI0GwgIFEC4YgATCAgoQABiABBhDGIoFwgIOEAAYgAQYkQIYsQMYigXCAhcQLhiABBiRAhixAxjRAxjHARjJAxiKBcICDRAuGIAEGLEDGEMYigXCAhAQLhiABBixAxhDGIMBGIoFwgIQEAAYgAQYsQMYQxjJAxiKBZgDCfEFwClWDApzulmIBgGQBgi6BgYIARABGAGSBwUyLjUuMaAHtl-yBwUwLjUuMbgH6QjCBwUyLTcuMcgHKYAIAA&sclient=gws-wiz-serp#lrd=0x3be7b9b24c556745:0x394d83a5b37880b2,3,,,,";
    
    window.open(reviewUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div 
      className="min-h-screen w-full overflow-auto" 
      style={{ 
        backgroundImage: `url(${bgPattern})`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <MediaPreloader onComplete={() => setMediaReady(true)} />

      {/* Main content container - compact spacing, minimal top padding */}
      <div className="flex flex-col items-center w-full px-4 pt-0 pb-2">

        {/* Logo Image - big and at top, negative margin to pull up */}
        <div className="flex flex-col items-center w-full -mt-12">
          <img
            src={logoImage}
            alt="Barrelborn Dine & Draft"
            className="w-[380px] h-auto"
          />
        </div>

        {/* Social Media Icons - directly under logo, negative margin to compensate for logo whitespace */}
        <div className="flex gap-3 -mt-14">
          <button
            onClick={() => handleSocialClick("https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}
            className="w-11 h-11 border rounded-md flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ borderColor: '#dcd4c8', backgroundColor: 'transparent' }}
          >
            <SiInstagram className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          </button>
          <button
            onClick={() => handleSocialClick("https://facebook.com")}
            className="w-11 h-11 border rounded-md flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ borderColor: '#dcd4c8', backgroundColor: 'transparent' }}
          >
            <SiFacebook className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          </button>
          <button
            onClick={() => handleSocialClick("https://youtube.com")}
            className="w-11 h-11 border rounded-md flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ borderColor: '#dcd4c8', backgroundColor: 'transparent' }}
          >
            <SiYoutube className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          </button>
        </div>

        {/* Explore Menu Button */}
        <button
          onClick={() => setLocation("/menu")}
          className="mt-7 px-10 py-3 font-semibold border-2 rounded-full transition-colors flex items-center gap-2 text-base"
          style={{ borderColor: '#B8986A', color: '#dcd4c8', backgroundColor: 'transparent' }}
        >
          <Utensils className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          <span>EXPLORE OUR MENU</span>
        </button>

        {/* Rating Section */}
        <div className="text-center mt-5">
          <p className="font-medium text-base mb-2" style={{ color: '#dcd4c8' }}>
            Click to Rate us on Google
          </p>
          <div
            className="flex justify-center cursor-pointer gap-1"
            onClick={handleReviewClick}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-8 h-8" style={{ color: '#B8986A', fill: '#B8986A' }} />
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div className="text-center mt-5">
          <div
            className="border-2 rounded-full inline-block px-5 py-1 mb-2"
            style={{ borderColor: '#B8986A' }}
          >
            <span className="font-semibold text-sm" style={{ color: '#dcd4c8' }}>ADDRESS</span>
          </div>
          <div className="leading-snug text-sm" style={{ color: '#E8DFD1' }}>
            <p>Shop No: 3, Madanlal Dhingra Rd,</p>
            <p>beside Satranj Wafers, Bhakti Mandir,</p>
            <p>Panch Pakhdi, Thane West</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-4">
          <div
            className="border-2 rounded-full inline-block px-5 py-1 mb-2"
            style={{ borderColor: '#B8986A' }}
          >
            <span className="font-semibold text-sm" style={{ color: '#dcd4c8' }}>CONTACT</span>
          </div>
          <div className="text-sm" style={{ color: '#E8DFD1' }}>
            <p>+91 72086 17766</p>
            <p>info@barrelborn.in</p>
          </div>
        </div>

        {/* Website URL */}
        <p
          className="mt-4 cursor-pointer text-sm"
          style={{ color: '#B8986A' }}
          onClick={() => window.open("https://www.barrelborn.in", "_blank")}
        >
          www.barrelborn.in
        </p>

        {/* Developer Credit */}
        <div className="text-center mt-3 mb-4 text-xs" style={{ color: '#E8DFD1' }}>
          <p>Developed By</p>
          <p
            className="font-medium cursor-pointer"
            onClick={() => window.open("http://www.airavatatechnologies.com", "_blank")}
            style={{ color: '#B8986A' }}
          >
            AIRAVATA TECHNOLOGIES
          </p>
        </div>

      </div>
    </div>
  );
}
