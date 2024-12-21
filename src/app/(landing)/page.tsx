import { LandingContent } from '@/components/landing-content';
import { LandingFooter } from '@/components/landing-footer';
import { LandingNavbar } from '@/components/landing-navbar';

export default function Landing() {
  return (
    <div className='h-full'>
      <LandingNavbar />
      <LandingContent/>
      <LandingFooter/>
    </div>
  );
}
