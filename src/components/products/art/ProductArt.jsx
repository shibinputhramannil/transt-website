import { useReducedMotion } from 'framer-motion';
import ProductGlyph from '../ProductGlyph.jsx';
import ErpScene from './ErpScene.jsx';
import KitchenOsScene from './KitchenOsScene.jsx';
import KitchenMindScene from './KitchenMindScene.jsx';
import CommerceScene from './CommerceScene.jsx';
import KnowledgeScene from './KnowledgeScene.jsx';

/**
 * Product illustration for catalog cards and product pages, chosen by slug.
 *
 * Each scene is a still line drawing of what the product does, and plays a 3-second story while
 * `active` (card hover or focus, a touch card centred on screen, or the product page's slow
 * replay). Under reduced motion it stays still. Products without a scene of their own (a new
 * entry in products.js) get the generated emblem instead.
 *
 * To add a scene: create `<Name>Scene.jsx` here (viewBox 0 0 200 200, colours only from the
 * classes in ProductArt.module.css, timings through `cue()` in timeline.js) and register its slug.
 */
const SCENES = {
  erp: ErpScene,
  'kitchen-os': KitchenOsScene,
  'kitchenmind-ai': KitchenMindScene,
  ecommerce: CommerceScene,
  coreknowledge: KnowledgeScene,
};

export default function ProductArt({ product, active = false }) {
  const reduce = useReducedMotion();
  const Scene = SCENES[product.slug];
  if (!Scene) return <ProductGlyph seed={product.slug} active={active} />;
  return <Scene active={active && !reduce} />;
}
