import Hero from '../components/home/Hero.jsx';
import ServiceCards from '../components/home/ServiceCards.jsx';
import WhatWeDo from '../components/home/WhatWeDo.jsx';
import Process from '../components/home/Process.jsx';
import ContactSection from '../components/home/ContactSection.jsx';
import useSeo from '../hooks/useSeo.js';
import { pages } from '../data/seo.js';

export default function Home() {
  useSeo(pages['/']);
  return (
    <>
      <Hero />
      <WhatWeDo />
      <ServiceCards />
      <Process />
      <ContactSection />
    </>
  );
}
